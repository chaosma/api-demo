#!/usr/bin/env bash

help(){
    echo "admin.sh v1.0"
    echo "Usage: $ProgName <command> [options]"
    echo "commands:"
    echo "    deploy"
}


deploy(){
    echo "deploying smart contracts..."
    node admin.js deploy -t erc721
}

command=$1
case $command in
    "" | "-h" | "--help")
        help
        ;;
    *)
        shift
        ${command} $@
        if [ $? = 127 ]; then
            echo "Error: '$command' is not a known subcommand." >&2
            echo "       Run '$ProgName -h' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac
