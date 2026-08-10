<?php
$name = $_POST['name'];
$email = $_POST['email'];
$number = $_POST['number'];
$budget = $_POST['budget'];
$plan = $_POST['plan'];
$formattedTime = $_POST['formattedTime'];

// Get the user's IP address
$ip_address = $_SERVER['REMOTE_ADDR'];

$data = array(
    'name' => $name,
    'email' => $email,
    'number' => $number,
    'budget' => $budget,
    'plan' => $plan,
    'formattedTime' => $formattedTime,
    'ip_address' => $ip_address, // Add IP address to the data
);

$file = 'data.json';
$current_data = file_get_contents($file);
$array_data = json_decode($current_data, true);
$array_data[] = $data;
$final_data = json_encode($array_data, JSON_PRETTY_PRINT);
file_put_contents($file, $final_data);

echo "Data saved successfully!";
?>
