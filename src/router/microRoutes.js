export default function (homeRoute) {
  let prefix = '/'
  // if (window.__POWERED_BY_QIANKUN__) {
  //   prefix = '/jimdb/'
  // }

  const redirectPath = homeRoute && homeRoute.path === '/cluster/list' ? homeRoute : `${prefix}overview`
  console.log(`[jimdb]subRoute`, redirectPath)

  const routes = [
    {
      path: prefix + 'home',
      name: 'home',
      component: resolve => require([`@/components/home/index.vue`], resolve)
    },

    {
      path: prefix + 'home/noPermission',
      name: 'noPermission',
      component: resolve => require([`@/components/home/noPermission.vue`], resolve)
    },
    {
      path: prefix + 'home/notify',
      name: 'notify',
      component: resolve => require([`@/components/home/notify.vue`], resolve)
    },

    {
      // path: prefix === '/' ? prefix : prefix.substring(0, prefix.length - 1),
      path: '/',
      redirect: redirectPath,
      name: 'console',
      component: resolve => require([`@/components/console/index.vue`], resolve),
      children: [
        {
          path: 'cluster/list', // 注意不需要前面的'/'
          name: 'clusterList',
          meta: {
            crumbName: ['集群监控列表'],
            crumbPath: []
          },
          component: resolve => require([`@/components/origin/clusterList.vue`], resolve)
        },
        {
          path: 'cluster/detail',
          name: 'clusterDetail',
          meta: {
            crumbName: ['集群列表', '集群详情'],
            // crumbPath: [ prefix === '/' ? prefix.substring(1) + 'cluster/list' : prefix + 'overview' ]
            crumbPath: ['overview']
          },
          component: resolve => require([`@/components/console/cluster/detail.vue`], resolve)
        },
        {
          path: 'monitor',
          name: 'jimdbMonitor',
          meta: {
            crumbName: ['JIMDB监控'],
            crumbPath: []
          },
          component: resolve => require([`@/components/origin/jimdbMonitor.vue`], resolve)
        },
        {
          path: 'overview',
          name: 'overview',
          component: resolve => require([`@/components/origin/jimdb.vue`], resolve)
        },
        {
          path: 'alarm/showAlarm',
          name: 'showAlarm',
          meta: {
            crumbName: ['查看报警'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/alarm/showAlarm.vue`], resolve)
        },
        {
          path: 'cluster/apply',
          name: 'clusterApply',
          meta: {
            crumbName: ['集群列表', '集群申请'],
            // crumbPath: [ prefix === '/' ? prefix.substring(1) + 'cluster/list' : prefix + 'overview' ]
            crumbPath: ['overview']
          },
          component: resolve => require([`@/components/console/cluster/apply.vue`], resolve)
        },
        {
          path: 'cluster/setUp',
          name: 'clusterSetUp',
          meta: {
            crumbName: ['集群列表', '集群设置'],
            // crumbPath: [ prefix === '/' ? prefix.substring(1) + 'cluster/list' : prefix + 'overview' ]
            crumbPath: ['overview']
          },
          component: resolve => require([`@/components/console/cluster/setUp.vue`], resolve)
        },
        {
          path: 'logs/clusterLogs',
          name: 'clusterLogs',
          meta: {
            crumbName: ['集群日志'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/logs/clusterLogs.vue`], resolve)
        },
        {
          path: 'logs/optLogs',
          name: 'optLogs',
          meta: {
            crumbName: ['操作日志'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/logs/optLogs.vue`], resolve)
        },
        {
          path: 'report/clusterMonitor',
          name: 'clusterMonitor',
          meta: {
            crumbName: ['集群监控报表'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/report/clusterMonitor.vue`], resolve)
        },
        {
          path: 'report/clusterEfficient',
          name: 'clusterEfficient',
          meta: {
            crumbName: ['集群效能报表'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/report/clusterEfficient.vue`], resolve)
        },
        {
          path: 'report/memory',
          name: 'memory',
          meta: {
            crumbName: ['资源使用统计'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/report/memory.vue`], resolve)
        },
        {
          path: 'report/history',
          name: 'history',
          meta: {
            crumbName: ['内存历史统计'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/report/history.vue`], resolve)
        },
        {
          path: 'report/sheet',
          name: 'sheet',
          meta: {
            crumbName: ['集群操作报表'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/report/sheet.vue`], resolve)
        },
        {
          path: 'dispatch/simulatePlatform',
          name: 'simulatePlatform',
          meta: {
            crumbName: ['仿真平台'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/dispatch/simulatePlatform.vue`], resolve)
        },
        {
          path: 'manage/apply',
          name: 'manageApply',
          meta: {
            crumbName: ['我的申请'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/apply.vue`], resolve)
        },
        {
          path: 'manage/myApplyDetail',
          name: 'myApplyDetail',
          meta: {
            crumbName: ['我的申请', '申请详情'],
            crumbPath: [prefix.substring(1) + 'manage/apply']
          },
          component: resolve => require([`@/components/console/manage/applyDetail.vue`], resolve)
        },
        {
          path: 'manage/processed',
          name: 'processed',
          meta: {
            crumbName: ['待我处理'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/processed.vue`], resolve)
        },
        {
          path: 'manage/audit',
          name: 'audit',
          meta: {
            crumbName: ['待我处理', '申请审核'],
            crumbPath: [prefix.substring(1) + 'manage/processed']
          },
          component: resolve => require([`@/components/console/manage/audit.vue`], resolve)
        },
        {
          path: 'manage/newSpaceAudit',
          name: 'newSpaceAudit',
          meta: {
            crumbName: ['待我处理', '申请审核'],
            crumbPath: [prefix.substring(1) + 'manage/processed']
          },
          component: resolve => require([`@/components/console/manage/newSpaceAudit.vue`], resolve)
        },
        {
          path: 'manage/applyDetail',
          name: 'applyDetail',
          meta: {
            crumbName: ['待我处理', '申请详情'],
            crumbPath: [prefix.substring(1) + 'manage/processed']
          },
          component: resolve => require([`@/components/console/manage/applyDetail.vue`], resolve)
        },
        {
          path: 'manage/alarmRules',
          name: 'alarmRules',
          meta: {
            role: 0,
            crumbName: ['报警规则'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/alarmRules.vue`], resolve)
        },
        {
          path: 'manage/alarmMode',
          name: 'alarmMode',
          meta: {
            role: 2,
            crumbName: ['我的报警方式'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/alarmMode.vue`], resolve)
        },
        {
          path: 'manage/announcement',
          name: 'announcement',
          meta: {
            role: 0,
            crumbName: ['发布公告'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/announcement.vue`], resolve)
        },
        {
          path: 'manage/notify',
          name: 'notify',
          meta: {
            role: 0,
            crumbName: ['邮件通知'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/notify.vue`], resolve)
        },
        {
          path: 'manage/quota',
          name: 'admin',
          meta: {
            crumbName: ['配额设置'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/quota.vue`], resolve)
        },
        {
          path: 'manage/admin',
          name: 'admin',
          meta: {
            crumbName: ['管理员设置'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/admin.vue`], resolve)
        },
        {
          path: 'manage/disaster',
          name: 'disaster',
          meta: {
            crumbName: ['异地多活'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/manage/disaster.vue`], resolve)
        },
        {
          path: 'pool/ipListUser',
          name: 'ipListUser',
          meta: {
            crumbName: ['IP资源查询']
          },
          component: resolve => require([`@/components/console/pool/ipListUser.vue`], resolve)
        },
        {
          path: 'pool/poolList',
          name: 'poolList',
          meta: {
            crumbName: ['资源列表']
          },
          component: resolve => require([`@/components/console/pool/poolList.vue`], resolve)
        },
        {
          path: 'pool/jdosList',
          name: 'jdosList',
          meta: {
            crumbName: ['资源列表']
          },
          component: resolve => require([`@/components/console/pool/jdosList.vue`], resolve)
        },
        {
          path: 'pool/poolZoneList',
          name: 'poolZoneList',
          meta: {
            crumbName: ['资源分区列表']
          },
          component: resolve => require([`@/components/console/pool/poolZoneList.vue`], resolve)
        },
        {
          path: 'pool/poolUseList',
          name: 'poolUseList',
          meta: {
            crumbName: ['资源使用列表']
          },
          component: resolve => require([`@/components/console/pool/poolUseList.vue`], resolve)
        },
        {
          path: 'pool/topy',
          name: 'poolTopy',
          meta: {
            crumbName: ['资源列表', '拓扑'],
            crumbPath: [prefix.substring(1) + 'pool/poolUseList']
          },
          component: resolve => require([`@/components/console/pool/poolTopy.vue`], resolve)
        },
        {
          path: 'pool/Monitor',
          name: 'poolMonitor',
          meta: {
            crumbName: ['资源列表', '监控'],
            crumbPath: [prefix.substring(1) + 'pool/poolUseList']
          },
          component: resolve => require([`@/components/console/pool/poolMonitor.vue`], resolve)
        },
        {
          path: 'pool/jdosMonitor',
          name: 'pooljdosMonitor',
          meta: {
            crumbName: ['资源列表', 'jdos监控'],
            crumbPath: [prefix.substring(1) + 'pool/poolUseList']
          },
          component: resolve => require([`@/components/console/pool/pooljdosMonitor.vue`], resolve)
        },
        {
          path: 'pool/instanceMonitor',
          name: 'instanceMonitor',
          meta: {
            crumbName: ['资源列表', '实例监控对比'],
            crumbPath: [prefix.substring(1) + 'pool/instanceMonitor']
          },
          component: resolve => require([`@/components/console/pool/instanceMonitor.vue`], resolve)
        },
        {
          path: 'pool/multizoneCluster',
          name: 'multizoneCluster',
          meta: {
            crumbName: ['跨分区的集群']
          },
          component: resolve => require([`@/components/console/pool/multizoneCluster.vue`], resolve)
        },
        {
          path: 'pool/multizoneIP',
          name: 'multizoneIP',
          meta: {
            crumbName: ['跨分区的IP']
          },
          component: resolve => require([`@/components/console/pool/multizoneIP.vue`], resolve)
        },
        {
          path: 'dispatch/apply',
          name: 'dispatchApply',
          meta: {
            crumbName: ['调度申请'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/dispatch/apply.vue`], resolve)
        },
        {
          path: 'dispatch/threshold',
          name: 'dispatchThreshold',
          meta: {
            crumbName: ['调度阀值'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/dispatch/threshold.vue`], resolve)
        },
        {
          path: 'dispatch/state',
          name: 'dispatchState',
          meta: {
            crumbName: ['调度状态'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/dispatch/state.vue`], resolve)
        },
        {
          path: 'tools/appStatus',
          name: 'appStatus',
          meta: {
            crumbName: ['应用状态'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/tools/appStatus.vue`], resolve)
        },
        {
          path: 'tools/failOver',
          name: 'failOver',
          meta: {
            crumbName: ['故障处理'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/tools/failOver.vue`], resolve)
        },
        {
          path: 'tools/failOverInstances',
          name: 'failOverInstances',
          meta: {
            crumbName: ['故障处理实例'],
            crumbPath: []
          },
          component: resolve => require([`@/components/console/tools/failOverInstances.vue`], resolve)
        }
      ]
    }
    // {
    //   path: '*',
    //   redirect: prefix === '/' ? '/overview' : prefix + 'overview'
    // }
  ]

  return routes
}
