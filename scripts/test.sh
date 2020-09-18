#!/bin/bash
# Script to quickly create sub-theme.

parentfoldername="$(basename "$(dirname "$(dirname $PWD)")")"
echo $parentfoldername
