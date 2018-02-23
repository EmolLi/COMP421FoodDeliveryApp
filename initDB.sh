#!/usr/bin/env bash

# set up the database
GREEN='\033[0;32m'
NC='\033[0m'

printf "${GREEN}============Clean Up DB===========\n${NC}"
psql << EOF
\i scripts/cleanup.sql
EOF

printf "${GREEN}============Create Tables===========\n${NC}"
psql << EOF
\i scripts/table_init.sql
EOF

printf "${GREEN}============Insert Data===========\n${NC}"
psql << EOF
\i scripts/dataGeneration/insert.sql
EOF


printf "${GREEN}============Table Summary===========\n${NC}"
psql << EOF
\i scripts/tableSummary.sql
EOF

