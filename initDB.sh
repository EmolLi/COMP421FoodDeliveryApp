#/bin/bash
#
# set up the database
GREEN='\033[0;32m'
NC='\033[0m'

printf "${GREEN}============Clean Up DB===========\n${NC}"
psql << EOF
\i scripts/cleanup.sql
EOF

printf "${GREEN}============Insert Tables===========\n${NC}"
psql << EOF
\i scripts/table_init.sql
EOF
