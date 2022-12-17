provider "aws" {
  region = "us-west-2"
}

locals {
  repo_name = "I-Tai-technical-challenge"
  env = "dev"
  tags = {
    owner = "452999669"
    repo  = "https://github.com/byu-oit-training/${local.repo_name}"
  }
}

resource "aws_ssm_parameter" "database_username" {
  name  = "/${local.repo_name}/${local.env}/database_username"
  type  = "SecureString"
  value = var.database_username
  tags  = local.tags
}

variable "database_username" {
  type = string
}

resource "aws_ssm_parameter" "database_password" {
  name  = "/${local.repo_name}/${local.env}/database_password"
  type  = "SecureString"
  value = var.database_password
  tags  = local.tags
}

variable "database_password" {
  type = string
}