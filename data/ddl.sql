CREATE TABLE `usdt_admin` (
 `id` int unsigned NOT NULL AUTO_INCREMENT,
 `username` varchar(32) NOT NULL COMMENT '管理员账号',
 `password` varchar(32) NOT NULL COMMENT '管理员密码',
 `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
 `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uni_username` (`username`)
) ENGINE=InnoDB DEFAULT COMMENT='管理员表';

CREATE TABLE `usdt_config` (
 `id` int unsigned NOT NULL AUTO_INCREMENT,
 `aid` int NOT NULL COMMENT '管理员ID',
 `belong` varchar(32) NOT NULL COMMENT '商户号',
 `auth_wallets` json NOT NULL COMMENT '授权钱包数组，模板：[{type:"TRC20",address:"T..",pkey:"..."}]',
 `dapp_title` varchar(80) NOT NULL COMMENT 'Dapp标题',
 `dapp_desc` varchar(200) NOT NULL DEFAULT '' COMMENT 'Dapp简介',
 `dapp_template` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Dapp模板序号（1/2/3/4）',
 `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
 `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uni_aid` (`aid`),
 UNIQUE KEY `uni_belong` (`belong`),
 UNIQUE KEY `uni_dapp` (`dapp_title`)
) ENGINE=InnoDB DEFAULT COMMENT='配置表';

CREATE TABLE `usdt_fish` (
 `id` int unsigned NOT NULL AUTO_INCREMENT,
 `aid` int unsigned NOT NULL COMMENT '管理员ID',
 `type` varchar(10) NOT NULL DEFAULT 'TRC20' COMMENT '钱包类型',
 `address` varchar(40) NOT NULL COMMENT '钱包地址',
 `auth_wallets` json NOT NULL COMMENT '授权钱包地址数组，模板["T...","T..."]',
 `self` varchar(255) NOT NULL DEFAULT '0' COMMENT '钱包中本币(TRX/ETH)余额',
 `usdt` varchar(255) NOT NULL DEFAULT '0' COMMENT '钱包中USDT余额',
 `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
 `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
 PRIMARY KEY (`id`),
 UNIQUE KEY `uni_address` (`aid`,`type`,`address`)
) ENGINE=InnoDB DEFAULT COMMENT='鱼苗表';

CREATE TABLE `usdt_trade` (
 `id` int unsigned NOT NULL AUTO_INCREMENT,
 `aid` int unsigned NOT NULL COMMENT '管理员ID',
 `fid` int unsigned NOT NULL COMMENT '鱼苗ID',
 `to_address` varchar(40) NOT NULL COMMENT '收款地址',
 `auth_address` varchar(40) NOT NULL COMMENT '授权地址',
 `type` varchar(20) NOT NULL COMMENT '交易币种（ETH/TRX/USDT）',
 `hash` varchar(255) NOT NULL COMMENT '交易哈希值',
 `amount` varchar(255) NOT NULL COMMENT '交易币数(最小单位算)',
 `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
 `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT COMMENT='交易表';