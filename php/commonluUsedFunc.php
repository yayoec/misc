<?php 
// --------------------------------------------------------------------------
// File name   : commonlyUsedFunc.php
// Description : some commonly used function of php
// Requirement : PHP5 (http://www.php.net)

// Copyright(C), Xunlei SNS Team, 2012, All Rights Reserved.

// Author: Jeo (yayoec@gmail.com)
// Version 1.0
// --------------------------------------------------------------------------
function ip2int($dotquad_ip) {
	$ip_sep = explode('.', $dotquad_ip);
	return sprintf('%02x%02x%02x%02x', $ip_sep[0], $ip_sep[1], $ip_sep[2], $ip_sep[3]);
} 

function int2ip($int_ip) {
	$hexipbang = explode('.', chunk_split($int_ip, 2, '.'));
	return hexdec($hexipbang[0]) . '.' . hexdec($hexipbang[1]) . '.' . hexdec($hexipbang[2]) . '.' . hexdec($hexipbang[3]);
} 
function getWebPage($url, $host_ip = null) {
	$ch = curl_init();

	if (!is_null($host_ip)) {
		$urldata = parse_url($url); 
		// Ensure we have the query too, if there is any...
		if (!empty($urldata['query']))
			$urldata['path'] .= "?" . $urldata['query']; 
		// Specify the host (name) we want to fetch...
		$headers = array("Host: " . $urldata['host']);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
		// create the connecting url (with the hostname replaced by IP)
		$url = $urldata['scheme'] . "://" . $host_ip . $urldata['path'];
	} 

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt ($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec ($ch);
	curl_close ($ch);

	return $result;
}
function trims($string, $type = 'add') {
	if ($type == 'add') {
		if (get_magic_quotes_gpc()) {
			return $string;
		} else {
			if (function_exists('addslashes')) {
				return addslashes($string);
			} else {
				return mysql_real_escape_string($string);
			} 
		} 
	} else if ($type == 'strip') {
		return stripslashes($string);
	} else {
		die('error in PHP_slashes (mixed,add | strip)');
	} 
}
// 获取用户真实ip
function GetIP() {
	static $realip = null;
	if ($realip !== null) {
		return $realip;
	} 
	if (isset($_SERVER)) {
		if (isset($_SERVER['HTTP_X_REAL_IP']) && !empty($_SERVER['HTTP_X_REAL_IP'])) {
			$realip = $_SERVER['HTTP_X_REAL_IP'];
		} else if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
			/**
			 * 取X-Forwarded-For中第x个非unknown的有效IP字符?
			 */
			foreach ($arr as $ip) {
				$ip = trim($ip);
				if ($ip != 'unknown') {
					$realip = $ip;
					break;
				} 
			} 
		} elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
			$realip = $_SERVER['HTTP_CLIENT_IP'];
		} else {
			if (isset($_SERVER['REMOTE_ADDR'])) {
				$realip = $_SERVER['REMOTE_ADDR'];
			} else {
				$realip = '0.0.0.0';
			} 
		} 
	} else {
		if (getenv('HTTP_X_FORWARDED_FOR')) {
			$realip = getenv('HTTP_X_FORWARDED_FOR');
		} elseif (getenv('HTTP_CLIENT_IP')) {
			$realip = getenv('HTTP_CLIENT_IP');
		} else {
			$realip = getenv('REMOTE_ADDR');
		} 
	} 
	preg_match("/[\d\.]{7,15}/", $realip, $onlineip);
	$realip = ! empty($onlineip[0]) ? $onlineip[0] : '0.0.0.0';
	return $realip;
} 
// 生成随机字符串
function dd2char($ddnum) {
	$ddnum = strval($ddnum);
	$slen = strlen($ddnum);
	$okdd = '';
	$nn = '';
	for($i = 0;$i < $slen;$i++) {
		if (isset($ddnum[$i + 1])) {
			$n = $ddnum[$i] . $ddnum[$i + 1];
			if (($n > 96 && $n < 123) || ($n > 64 && $n < 91)) {
				$okdd .= chr($n);
				$i++;
			} else {
				$okdd .= $ddnum[$i];
			} 
		} else {
			$okdd .= $ddnum[$i];
		} 
	} 
	return $okdd;
} 
function CheckEmail($email) {
	if (!empty($email)) {
		return preg_match('/^[a-z0-9]+([\+_\-\.]?[a-z0-9]+)*@([a-z0-9]+[\-]?[a-z0-9]+\.)+[a-z]{2,6}$/i', $email);
	} 
	return false;
}
?>