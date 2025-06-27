#!/bin/bash
echo "Digite a versão da release que deseja finalizar:"
read VERSION
git flow release finish "$VERSION"
