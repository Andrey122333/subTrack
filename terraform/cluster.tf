resource "yandex_kubernetes_cluster" "cluster" {
  name        = "main-cluster"
  network_id  = yandex_vpc_network.network.id
  folder_id   = "b1g2e0bntrf4cfr29qsr"
  description = "Main Kubernetes cluster"

  master {
    version   = "1.29"
    public_ip = true
    
    zonal {
      zone      = yandex_vpc_subnet.subnet.zone
      subnet_id = yandex_vpc_subnet.subnet.id
    }
  }

  service_account_id      = yandex_iam_service_account.k8s-sa.id
  node_service_account_id = yandex_iam_service_account.k8s-sa.id

  depends_on = [
    yandex_resourcemanager_folder_iam_binding.roles,
    yandex_vpc_subnet.subnet
  ]
}

resource "yandex_kubernetes_node_group" "nodes" {
  cluster_id = yandex_kubernetes_cluster.cluster.id
  name       = "worker-nodes"
  version    = "1.29"

  instance_template {
    platform_id = "standard-v2"
    
    resources {
      memory = 4
      cores  = 2
    }

    boot_disk {
      type = "network-hdd"
      size = 64
    }

    network_interface {
      subnet_ids = [yandex_vpc_subnet.subnet.id]
      nat        = true
    }
  }

  scale_policy {
    fixed_scale {
      size = 2
    }
  }

  depends_on = [
    yandex_kubernetes_cluster.cluster
  ]
}