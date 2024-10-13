## hzpx server
	?g=形&svg=1&size=24&color=black

	size,color, svg are option,
	return png if svg=1 is missing

    ?component=如
    return 女口

    ?part=果
	return 𠒪𠜴𠪧𠵩𡅁𡱼𡸖𢃦𢑥𢒙𢻔...

accelon/hzpx
    node dump-glyphwiki.js

copy glyphwiki-dump.txt to this folder

accelon/hzpx-engine

    rollup -c

copy index.cjs to hzpx-engine.cjs in this folder
deploy server.js , hzpx-engine.cjs , glyphwiki-dump.txt to https server


steps on https server

setup proxy https://hackmd.io/@EttaWang0118/rktS4fjVu

    npm i svg2img

    sudo vi /etc/systemd/system/hzpx.service

```
[Unit]
After=network.target
Description=hzpx
[Service]
Type=simple
Environment=
# 執行服務的使用者
User=[user_who_execute_this_service]
# 啟動服務指令
ExecStart=node /home/yap/hzpxserver/server.js
# 不正常停止時重新啟動
Restart=on-failure
[Install]
WantedBy=multi-user.target
```
	sudo a2enmod ssl
	sudo a2enmod proxy
	sudo a2enmod proxy_balancer
	sudo a2enmod proxy_http

    sudo systemctl start hzpx
    sudo vi /etc/apache2/sites-enable/000-default



```
<VirtualHost *:443>
	ServerName [web.domain.com]
	ServerAlias [domain.com] #其他網址也可以連到同一個目錄
	SSLEngine On
	SSLProxyEngine on
	SSLProxyVerify none
	SSLProxyCheckPeerCN off
	SSLProxyCheckPeerName off
	SSLProxyCheckPeerExpire off
	SSLCertificateFile          [path_of_certificate.crt]
	SSLCertificateKeyFile       [path_of_private.key]
	SSLCertificateChainFile     [path_of_ca_bundle.crt]
	ProxyPass /hzpx https://localhost:5080/
	ProxyPassReverse /hzpx https://localhost:5080/
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
#    Header always set Content-Security-Policy "default-src 'self';"   # this will cause ylz unable to run
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin"
    Header always set Permissions-Policy "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()"
	<Proxy *>
		Order deny,allow
		Deny from all
		Allow from all
	</Proxy>
</VirtualHost>
```