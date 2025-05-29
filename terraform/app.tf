provider "kubernetes" {
  host                   = yandex_kubernetes_cluster.cluster.master[0].external_v4_endpoint
  cluster_ca_certificate = yandex_kubernetes_cluster.cluster.master[0].cluster_ca_certificate
  token                  = data.yandex_client_config.client.iam_token


  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "yc"
    args        = [
      "k8s",
      "create-token",
      "--profile=devops"
    ]
  }
}

resource "kubernetes_namespace" "app" {
  metadata {
    name = "app"
  }
}

resource "kubernetes_persistent_volume_claim" "mongo-pvc" {
  metadata {
    name      = "mongo-pvc"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "yc-network-hdd"  # Обязательно для Yandex Cloud
    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mongo"
      }
    }
    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }
      spec {
        container {
          name  = "mongo"
          image = "mongo:6.0"
          port {
            container_port = 27017
          }
          volume_mount {
            name       = "mongo-storage"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "mongo-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mongo-pvc.metadata[0].name
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_persistent_volume_claim.mongo-pvc
  ]
}

# Application
resource "kubernetes_deployment" "app" {
  metadata {
    name      = "app"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "app"
      }
    }
    template {
      metadata {
        labels = {
          app = "app"
        }
      }
      spec {
        container {
          name  = "app"
          image = "andrey122333/sub-server:dev"
          port {
            container_port = 4000
          }
          env {
            name  = "MONGO_URI"
            value = "mongodb://admin:password@mongo.app.svc.cluster.local:27017/subscriptions?authSource=admin"
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_deployment.mongo
  ]
}

# Services
resource "kubernetes_service" "app" {
  metadata {
    name      = "app"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = {
      app = "app"
    }
    port {
      port        = 4000
      target_port = 4000
    }
    type = "ClusterIP"
  }
}

# Пример сервиса с LoadBalancer
resource "kubernetes_service" "nginx" {
  metadata {
    name      = "nginx"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = {
      app = "nginx"
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_ingress_v1" "app" {
  metadata {
    name      = "app-ingress"
    namespace = kubernetes_namespace.app.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
    }
  }
  spec {
    rule {
      http {
        path {
          path = "/"
          backend {
            service {
              name = "app"
              port {
                number = 4000
              }
            }
          }
        }
      }
    }
  }
}