<?php

$csv = array_map('str_getcsv', file('http://webrates.truefx.com/rates/connect.html?f=csv'));
// sort($csv); //Можно и тут сортировать, чтобы в любом случае получить отсортированный массив
echo json_encode($csv);
?>
