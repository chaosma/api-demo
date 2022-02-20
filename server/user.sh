#!/usr/bin/env bash

ProgName=$(basename $0)
DirName=$(dirname $0)

# post request params
POST_URI="http://localhost:8080/post/"
# params
version="v0.1"

function help(){
    echo "Usage: $ProgName <command> [options]"
    echo "commands:"
    echo "    mint -a <userAddress> -i <tokenid> -x <contractAddr>"
    echo "    transfer -f <from> -t <to> -i <tokenid> -x <contractAddr>"
}

function mint(){
    while [[ $# -gt 0 ]]; do
      key="$1"
      case $key in
        -a|--address)
          addr="$2"
          shift 
          shift 
          ;;
        -x|--contract)
          contract="$2"
          shift 
          shift 
          ;;
        -i|--tokenId)
          tid="$2"
          shift 
          shift 
          ;;
        *)   
          shift
          ;;
      esac
    done

    json_fmt='{"method":"%s","address":"%s","contract":"%s","tokenId":"%s","version":"%s"}'
    json_str=$(printf "$json_fmt" "mint" "$addr" "$contract" "$tid" "$version")
    post_request $json_str
}

function transfer(){
    while [[ $# -gt 0 ]]; do
      key="$1"
      case $key in
        -f|--from)
          from="$2"
          shift 
          shift 
          ;;
        -t|--to)
          to="$2"
          shift 
          shift 
          ;;
        -x|--contract)
          contract="$2"
          shift 
          shift 
          ;;
        -i|--tokenId)
          tid="$2"
          shift
          shift
          ;;
        *)   
          shift
          ;;
      esac
    done

    json_fmt='{"method":"%s","contract":"%s","from":"%s","to":"%s","tokenId":"%s","version":"%s"}'
    json_str=$(printf "$json_fmt" "transfer" "$contract" "$from" "$to" "$tid" "$version")
    post_request $json_str
}

function get_request() {
    res=$(curl $GET_URI)
    echo $res
}

function post_request() {
   res=$(curl -X POST $POST_URI -H 'content-type: application/json' -d "$1")
   echo $res
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
