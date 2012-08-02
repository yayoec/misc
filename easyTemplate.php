<?php
// --------------------------------------------------------------------------
// File name   : easyTemplate.php
// Description : 简易模板 
// Requirement : PHP5 (http://www.php.net)
//
// Copyright(C), Xunlei SNS Team, 2012, All Rights Reserved.
//
// Author: Jeo (yayoec@gmail.com)
// Version 1.0
// --------------------------------------------------------------------------
class Template {
	private $_tpl_path = NULL;
	private $_tpl_vars = NULL;
	private $_tpl_replace = NULL;
	private $_tpl_content = NULL;
	
	public function __construct($tpl_path=NULL) {
		$this->_tpl_path = $tpl_path;
		$this->_tpl_vars = array();
		$this->_tpl_replace = array();
		$this->_tpl_content = NULL;
	}
	
	public function assign($tpl_var, $value) {
		if (is_array($tpl_var)){
            foreach ($tpl_var as $key => $val) {
                if ($key != '') $this->_tpl_vars[$key] = $val;
            }
        } else {
            if ($tpl_var != '') $this->_tpl_vars[$tpl_var] = $value;
        }
	}
	
	function append($tpl_var, $value=null, $merge=false) {
        if (is_array($tpl_var)) {
            // $tpl_var is an array, ignore $value
            foreach ($tpl_var as $_key => $_val) {
                if ($_key != '') {
                    if(!@is_array($this->_tpl_vars[$_key])) {
                        settype($this->_tpl_vars[$_key],'array');
                    }
                    if($merge && is_array($_val)) {
                        foreach($_val as $_mkey => $_mval) {
                            $this->_tpl_vars[$_key][$_mkey] = $_mval;
                        }
                    } else {
                        $this->_tpl_vars[$_key][] = $_val;
                    }
                }
            }
        } else {
            if ($tpl_var != '' && isset($value)) {
                if(!@is_array($this->_tpl_vars[$tpl_var])) {
                    settype($this->_tpl_vars[$tpl_var],'array');
                }
                if($merge && is_array($value)) {
                    foreach($value as $_mkey => $_mval) {
                        $this->_tpl_vars[$tpl_var][$_mkey] = $_mval;
                    }
                } else {
                    $this->_tpl_vars[$tpl_var][] = $value;
                }
            }
        }
    }
    
	function clear_assign($tpl_var=NULL) {
		if (is_null($tpl_var)) {
			unset($this->_tpl_vars);
		} else {
	        if (is_array($tpl_var))
	            foreach ($tpl_var as $curr_var)
	                unset($this->_tpl_vars[$curr_var]);
	        else
	            unset($this->_tpl_vars[$tpl_var]);
		}
    }
	
	public function parse($search, $replace) {
		$this->_tpl_replace[] = array($search, $replace);
	}
	
	private function _replace($content) {
		if (is_array($this->_tpl_replace)) {
			foreach ($this->_tpl_replace as $replace) {
				$content = str_replace($replace[0], $replace[1], $content);
			}
		}
		return $content;
	}
	
	public function fetch($tpl_path=NULL) {
		if (!is_null($tpl_path)) $this->_tpl_path = $tpl_path;
		if (is_null($this->_tpl_path)) throw new Exception("Miss template file!");
		extract($this->_tpl_vars);
		ob_end_flush();
		ob_start();
		require $this->_tpl_path;
		$this->_tpl_content = ob_get_contents();
		ob_end_clean();
		return $this->_replace($this->_tpl_content);
	}
	
	public function display($tpl_path=NULL) {
		echo $this->fetch($tpl_path);
	}
}
?>