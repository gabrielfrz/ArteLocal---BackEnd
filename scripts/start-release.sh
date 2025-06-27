#!/bin/bash
echo "Digite a versão da release (ex: 1.0.0):"
read VERSION
git flow release start "$VERSION"
