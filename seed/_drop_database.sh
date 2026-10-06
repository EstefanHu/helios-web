# TODO: Store db contents
yellow='\033[0;33m'
blue='\033[1;34m'
warningRed='\033[1;91m'
color_off='\033[0m'

db=heliosdb
user=helios

# Admin/maintenance connection -- see _generate.sh for why this is explicit.
maintenance_db="${MAINTENANCE_DB:-postgres}"
superuser="${PGUSER:-$(whoami)}"
admin="psql -U ${superuser} -d ${maintenance_db}"

if pg_isready -h localhost -p 5432 | grep -v "accepting"; then
    echo -e "${warningRed}NOTICE:${color_off} Could not connect to ${yellow}postgres${color_off}."
    echo -e "Make sure a local ${yellow}postgres${color_off} server is running then try runnig this command again"
    exit 1
fi

psql -U ${superuser} -d "${db}" -qc "REASSIGN OWNED BY ${user} TO ${superuser}"
psql -U ${superuser} -d "${db}" -qc "DROP OWNED BY ${user}"
$admin -qc "DROP ROLE ${user}"
$admin -qc "DROP DATABASE ${db}"

echo -e "Database ${yellow}${db}${color_off} and Role ${blue}${user}${color_off} have been dropped"