terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "0.97.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.23.0"
    }
  }
}

provider "yandex" {
  token     = "y0__xCVleylARjB3RMg5peq7hLJ6XulEtf8vViAUgCvBM9iUOLnsQ"
  cloud_id  = "b1gc2dmm1sm2dup2famp"
  folder_id = "b1g2e0bntrf4cfr29qsr"
  zone      = "ru-central1-a"
}

data "yandex_client_config" "client" {}