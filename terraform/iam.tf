resource "yandex_iam_service_account" "k8s-sa" {
  name        = "k8s-cluster-admin"
  description = "Service account for Kubernetes cluster"
}

resource "yandex_resourcemanager_folder_iam_binding" "roles" {
  for_each = toset([
    "k8s.admin",
    "vpc.admin",
    "compute.admin",
    "iam.serviceAccounts.user"
  ])

  folder_id = "b1g2e0bntrf4cfr29qsr"
  role      = each.key
  members = [
    "serviceAccount:${yandex_iam_service_account.k8s-sa.id}"
  ]
}