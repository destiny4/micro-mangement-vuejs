
/*
 * 接口统一集成模块
 */

import * as menu from '/Users/chenxiaolong/project/micro-management/src/api/base/menu.js'

import * as user from '/Users/chenxiaolong/project/micro-management/src/api/base/user.js'

import * as businessAdmin from '/Users/chenxiaolong/project/micro-management/src/api/business/Sys/businessAdmin/businessAdmin.js'

import * as menuAdmin from '/Users/chenxiaolong/project/micro-management/src/api/business/Sys/menuAdmin/menuAdmin.js'

import * as permsAdmin from '/Users/chenxiaolong/project/micro-management/src/api/business/Sys/permsAdmin/permsAdmin.js'

import * as roleAdmin from '/Users/chenxiaolong/project/micro-management/src/api/business/Sys/roleAdmin/roleAdmin.js'

import * as userAdmin from '/Users/chenxiaolong/project/micro-management/src/api/business/Sys/userAdmin/userAdmin.js'

// 默认全部导出
export default {
  menu, user, businessAdmin, menuAdmin, permsAdmin, roleAdmin, userAdmin
}
