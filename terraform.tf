terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
}


provider "yandex" {
  token     = "aje0qqvjfa2ee8hkg6i9"
  cloud_id  = "b1gc2dmm1sm2dup2fam"
  folder_id = "b1g2e0bntrf4cfr29qsr"
  zone      = "ru-central1-b"
}

resource "yandex_compute_instance" "vm-1" {
  name        = "docker-server"
  platform_id = "standard-v1"
  resources {
    cores         = 2
    memory        = 2
    core_fraction = 50
  }

  boot_disk {
    initialize_params {
      image_id = "fd84b1mojb8650b9luqd" # ID образа ОС
    }
  }

  network_interface {
    subnet_id = "default-ru-central1-b"
    nat       = true
  }

  metadata = {
    ssh-keys    = "devops:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDdq3CmYX8RuwTk3jAYS5pKnKBTKF3CaxiJqHy59KSfK andrew@DESKTOP-LI9297T"
    user-data   = <<EOF
#cloud-config
runcmd:
  - apt update && apt upgrade -y
  - apt install -y docker.io docker-compose
  - systemctl enable --now docker
EOF
  }
}
