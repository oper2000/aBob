#!/bin/sh

TEST_ROOT=$1
cd "$TEST_ROOT"
rm -rf instrumentscli*
killall "Simulator"
