<?php
header('Content-Type: application/json');

// Připojení k databázi Oracle
$username = 'ST72414';
$password = 'abcde';
$host = 'fei/sql3.upceucebnz.cy'; // nebo IP adresa serveru s Oracle databází
$port = '1521'; // port, na kterém běží Oracle
$sid = 'BDAS'; // SID nebo Service Name vaší Oracle databáze

$connectionString = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=$host)(PORT=$port)))(CONNECT_DATA=(SID=$sid)))";

$conn = oci_connect($username, $password, $connectionString);

if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

echo "Připojení k Oracle databázi bylo úspěšné!";

// Získání dat z požadavku
$data = json_decode(file_get_contents("php://input"), true);
$event_date = $data['event_date'];
$event_desc = $data['event_desc'];

// SQL dotaz pro vložení události
$sql = "INSERT INTO calendar_events (event_date, event_description) VALUES (TO_DATE(:event_date, 'YYYY-MM-DD'), :event_desc)";
$stmt = oci_parse($conn, $sql);
oci_bind_by_name($stmt, ':event_date', $event_date);
oci_bind_by_name($stmt, ':event_desc', $event_desc);

// Provedení dotazu
if (oci_execute($stmt)) {
    // Úspěch: vrácení potvrzení
    $response = array('status' => 'success', 'message' => 'Událost úspěšně vložena do databáze');
    echo json_encode($response);
} else {
    // Chyba: vrácení chybové zprávy
    $response = array('status' => 'error', 'message' => 'Chyba při vkládání události do databáze');
    echo json_encode($response);
}

// Uzavření spojení s databází
oci_free_statement($stmt);
oci_close($conn);
?>
