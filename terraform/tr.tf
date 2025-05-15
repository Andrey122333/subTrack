terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"         
    }
  }
}


provider "yandex" {
  token     = "y0__xCVleylARjB3RMg5peq7hLJ6XulEtf8vViAUgCvBM9iUOLnsQ"
  cloud_id  = "b1gc2dmm1sm2dup2famp"
  folder_id = "b1g2e0bntrf4cfr29qsr"
  zone      = "ru-central1-b"
}

resource "yandex_compute_instance" "vm-0" {
  name        = "docker-server"
  platform_id = "standard-v1"
  resources {
    cores         = 4
    memory        = 6
    core_fraction = 20
  }


  boot_disk {
    initialize_params {
      image_id = "fd82re2tpfl4chaupeuf"
      size      = 35              
      type      = "network-ssd" 
    }
  }

  network_interface {
    subnet_id = "e2l84d0v6buvdb9goni6"
    nat       = true
  }

  metadata = {
    ssh-keys    = "devops:${file("C:/Users/Andrew/.ssh/id_rsa.pub")}"
    user-data   = <<EOF
#cloud-config
datasource:
 Ec2:
  strict_id: false
ssh_pwauth: no
users:
- name: devops
  sudo: ALL=(ALL) NOPASSWD:ALL
  shell: /bin/bash
  ssh_authorized_keys:
  - ${file("C:/Users/Andrew/.ssh/id_rsa.pub")}


runcmd:
  - sudo apt update
  - sudo apt install -y docker.io
  - sudo apt install -y docker-compose
  - sudo systemctl enable docker
  - sudo systemctl start docker

EOF
  }
}