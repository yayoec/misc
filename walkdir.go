package main

import (
	"time"
	"fmt"
	"os"
	"strings"
	"path/filepath"
	//"github.com/go-redis/redis"
	"strconv"
)

var (
	//post_data_path = "data/logs/"
	//redis_file_queue_single = "sparrow_writing_file_queue"
	//redis_host = "192.168.122.131:6379"
	//redis_pass = "123456"
	//redis_db = 0
	//client = redis.NewClient(&redis.Options{
	//	Addr: redis_host   ,
	//	Password: redis_pass, // no password set
	//	DB:       redis_db,  // use default DB
	//})
)

func main(){
	local, _ := time.LoadLocation("Asia/Chongqing")
	t := time.Now()
	nd := t.In(local).Format("20060102")
	nd_t := t.In(local).Format("20060102/15")
	seek_path := fmt.Sprintf("%s%s", post_data_path, nd)
	tmps, _ := WalkDir(seek_path, "tmp")
	var file_num = 1
	for _, tmp_file := range tmps  {
		os.Rename(tmp_file, tmp_file[:len(tmp_file)-4])
	}
	cur_path := fmt.Sprintf("%s%s", post_data_path, nd_t)
	if _, err := os.Stat(cur_path); !os.IsNotExist(err) {
		tmps, _ = WalkDir(cur_path, "data")
	}
	if len(tmps) > 0 {
		last_file := tmps[len(tmps) - 1]
		i := strings.LastIndex(last_file, "\\")
		last_filename := last_file[i+1:]
		a := strings.TrimSuffix(last_filename, ".data")
		file_num, _ = strconv.Atoi(a)
		file_num++
	}
	fmt.Println(file_num)
	var (
		old_file_name string
		old_file_pointer * os.File
		//file_num = 1
		line = 0
	)
	for{
		if v,err := client.RPop(redis_file_queue_single).Result(); err == nil {
			local, _ := time.LoadLocation("Asia/Chongqing")
			t := time.Now()
			now := t.In(local).Format("20060102/15")
			data_dir := fmt.Sprintf("%s%s", post_data_path, now)
			file_name := fmt.Sprintf("%s/%d.data.tmp", data_dir, file_num)
			//if _, err := os.Stat(data_dir); os.IsNotExist(err) {
			if _, err := os.Stat(file_name); os.IsNotExist(err) {
				os.MkdirAll(data_dir, 0764)
				file_num = 1
			}
			//os.MkdirAll(data_dir, 0764)
			if old_file_name != file_name {
				// new hour, new file
				if _, err := os.Stat(old_file_name); !os.IsNotExist(err) {
					// rename
					if old_file_pointer != nil {
						old_file_pointer.Close()
					}
					os.Rename(old_file_name, old_file_name[:len(old_file_name)-4])
				}
				old_file_name = file_name
				f, _ := os.Create(file_name)
				//f.Close()
				//old_file_pointer, _ = os.OpenFile(file_name, os.O_APPEND, 777)
				old_file_pointer = f
				line = 0
			}
			old_file_pointer.WriteString(v + "\n")
			if line++; line > 100000 {
				// line > 100000, new file
				file_num += 1
			}
		} else {
			//fmt.Println("b")
			time.Sleep(1000 * time.Millisecond)
		}
	}
}

func WalkDir(dirPth, suffix string) (files []string, err error) {
	files = make([]string, 0, 30)
	suffix = strings.ToLower(suffix) //忽略后缀匹配的大小写
	if _, err := os.Stat(dirPth); os.IsNotExist(err) {
		return files, err
	}
	err = filepath.Walk(dirPth, func(filename string, fi os.FileInfo, err error) error { //遍历目录
		//if err != nil { //忽略错误
		//    return err
		//}
		if fi.IsDir() { // 忽略目录
			return nil
		}
		if strings.HasSuffix(strings.ToLower(fi.Name()), suffix) {
			files = append(files, filename)
		}
		return nil
	})
	return files, err
}
