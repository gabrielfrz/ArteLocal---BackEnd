#!/bin/bash
echo "Digite o nome da feature:"
read FEATURE
git flow feature start "$FEATURE"
