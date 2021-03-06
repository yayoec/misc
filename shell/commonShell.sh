#查看连接状态
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}' 

#查找请求数请20个IP(常用于查找攻来源)
netstat -ant |awk '/:80/{split($5,ip,":");++A[ip[1]]}END{for(i in A) print A[i],i}'|sort -rn|head -n20

#用tcpdump嗅探80端口的访问看看谁最高
tcpdump -i eth0 -tnn dst port 80 -c 1000 | awk -F"." '{print $1"."$2"."$3"."$4}' |sort | uniq -c | sort -nr |head -20

#查找较多time_wait连接
netstat -n|grep TIME_WAIT|awk '{print $5}'|sort|uniq -c|sort -rn|head -n20

#找查较多的SYN连接 
netstat -an | grep SYN | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c |sort -nr | more

#根据端口列进程 
netstat -ntlp | grep 80 | awk '{print $7}' | cut -d/ -f1

#获得访问前10位的ip地址
cat access.log|awk '{counts[$(11)]+=1}; END {for(url in counts) print counts[url], url}'

#访问次数最多的文件或页面,取前20
cat access.log|awk '{print $11}'|sort|uniq -c|sort -nr|head -20

#列出传输最大的几个exe文件（分析下载站的时候常用）
cat access.log |awk '($7~/\.exe/){print $10 " " $1 " " $4 " " $7}'|sort -nr|head -20

#列出输出大于200000byte(约200kb)的exe文件以及对应文件发生次数 
cat access.log |awk '($10 > 200000 && $7~/\.exe/){print $7}'|sort -n|uniq -c|sort -nr|head -100

#如果日志最后一列记录的是页面文件传输时间，则有列出到客户端最耗时的页面
cat access.log |awk  '($7~/\.php/){print $NF " " $1 " " $4 " " $7}'|sort -nr|head-100

#统计网站流量（G)
cat access.log |awk '{sum+=$10} END {print sum/1024/1024/1024}'

#统计404的连接
awk '($9 ~/404/)' access.log | awk '{print $9,$7}' | sort

#统计http status.
cat access.log |awk '{counts[$(9)]+=1}; END {for(code in counts) print code, counts1}'
cat access.log |awk '{print $9}'|sort|uniq -c|sort -rn

#查看是哪些蜘蛛在抓取内容
/usr/sbin/tcpdump -i eth0 -l -s 0 -w - dst port 80 | strings | grep -i user-agent |grep -i -E 'bot|crawler|slurp|spider'

#查看数据库执行的sql
/usr/sbin/tcpdump -i eth0 -s 0 -l -w - dst port 3306 | strings | egrep -i'SELECT|UPDATE|DELETE|INSERT|SET|COMMIT|ROLLBACK|CREATE|DROP|ALTER|CALL' 

#mysql备份实例，自动备份mysql，并删除30天前的备份文件
BAKDIR=/data/backup/mysql/`date +%Y-%m-%d`
MYSQLDB=www
MYSQLPW=backup
MYSQLUSR=backup
if [ $UID -ne 0 ];then
  echo This script must use administrator or root user ,please exit!
	sleep 2
	exit 0
fi
if [ ! -d $BAKDIR ];then
	mkdir -p $BAKDIR
else
	echo This is $BAKDIR exists ,please exit ….
	sleep 2
	exit
fi

###mysqldump backup mysql
/usr/bin/mysqldump -u$MYSQLUSR -p$MYSQLPW -d $MYSQLDB >/data/backup/mysql/`date +%Y-%m-%d`/www_db.sql
cd $BAKDIR ; tar -czf  www_mysql_db.tar.gz *.sql
cd $BAKDIR ;find  . -name “*.sql” |xargs rm -rf
[ $? -eq 0 ]&&echo “This `date +%Y-%m-%d` RESIN BACKUP is SUCCESS”
cd /data/backup/mysql/ ;find . -mtime +30 |xargs rm -rf

#这个脚本是针对所有tar文件在一个目录，但是实际情况中，有可能在下级或者更深的目录，我们可以使用find查找
PATH1=/tmp/images
PATH2=/usr/www/images
for i in `find  $PATH1  -name  ”*.tar” `
do
	tar xvf  $i  -C $PATH2
done

#随机取用户
cat  file1 | awk '{ print rand(),$1 }' |sort -k1 |awk '{ print $2 }' |head -4000

#分组求和
awk '{s[$1] += $2}END{ for(i in s){  print i, s[i] } }' file1 > file2
#求和
cat data|awk '{sum+=$1} END {print "Sum = ", sum}'
#求平均
cat data|awk '{sum+=$1} END {print "Average = ", sum/NR}'
#标准偏差
cat $FILE | awk -v ave=$ave '{sum+=($1-ave)^2}END{print sqrt(sum/(NR-1))}'
