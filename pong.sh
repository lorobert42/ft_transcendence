#!/bin/bash

function login() {
    local email="$1"
    local password="$2"
    local data="{
        \"email\": \"${email}\",
        \"password\": \"${password}\"
    }"
    local response=$(curl --location --insecure --request POST "https://${host}:8080/api/user/login/" \
    --header 'Content-Type: application/json' \
    --data "${data}")
    local access=$(jq -r '.access' <<< "${response}")
    echo "${access}"
}

function get_user_id() {
    local access="$1"
    local response=$(curl --location --insecure --request GET "https://${host}:8080/api/user/me/" \
    --header "Authorization: Bearer ${access}")
    local id=$(jq -r '.id' <<< "${response}")
    echo "${id}"
}

read -p "Enter server name: " host
read -p "Enter your email: " email
read -sp "Enter your password: " password

access="$(login ${email} ${password})"
if [ "${access}" = "null" ]; then
    echo "Invalid credentials."
    exit 1
fi
echo "${access}"

id="$(get_user_id ${access})"
echo "${id}"

count=0
while true; do
    if [ "${count}" -eq 0 ]; then
        echo -e '{"join":"local","player_1_type":"human","player_2_type":"bot"}\n{"start":"start"}'
        (( ++count ))
    else
        read -rsn1 input
        if [ "${input}" = "w" ]; then
            echo '{"local":"P1_UP"}'
        elif [ "${input}" = "s" ]; then
            echo '{"local":"P1_DOWN"}'
        fi
    fi
done > >(websocat -k "wss://${host}:8080/ws/game/local${id}/?token=${access}")
