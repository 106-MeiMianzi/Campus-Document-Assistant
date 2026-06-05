<template>
  <div class="service-page">
    <Navbar />

    <div class="service-content">
      <!-- 标题区域 -->
      <section class="service-hero">
        <div class="container">
          <div ref="heroBadgeRef" class="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            一站式服务
          </div>
          <h1 ref="heroTitleRef" class="hero-title">校园办事大厅</h1>
          <p ref="heroDescRef" class="hero-desc">快速查看校园事务办理流程，每一步都清晰可循</p>
        </div>
      </section>

      <!-- 卡片网格 -->
      <section class="service-main container">
        <div ref="serviceGridRef" class="service-grid">
          <div
            v-for="item in services"
            :key="item.id"
            class="service-card card card-clickable"
            @click="router.push(item.route)"
          >
            <div class="card-icon" :style="{ background: item.gradient }">
              <div v-html="item.icon"></div>
            </div>
            <div class="card-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
            <div class="card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 底部 -->
    <footer class="service-footer">
      <img ref="bottomIllustRef" src="/svg/办事%201.svg" alt="" class="footer-illust" />
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { gsap } from '../plugins/gsap'

const router = useRouter()
const heroBadgeRef = ref(null)
const heroTitleRef = ref(null)
const heroDescRef = ref(null)
const serviceGridRef = ref(null)
const bottomIllustRef = ref(null)
let ctx, bottomIllustObserver

const services = [
  {
    id: 1,
    route: '/service/scholarship',
    title: '奖学金申请',
    desc: '国家奖学金、学业奖学金的申请条件、材料与审批流程',
    contact: '学生处奖助贷中心：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #FDF0E8, #FBE8D8)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    steps: [
      { title: '提交申请', desc: '填写《奖学金申请审批表》，附成绩单及获奖证明材料，提交至辅导员处', status: 'done', dept: '各学院学生工作办公室', time: '9月1日—9月15日', material: '申请表、成绩单、获奖证书复印件' },
      { title: '班级/专业评议', desc: '由辅导员组织班级或专业评议小组对申请人进行综合评定', status: 'done', dept: '辅导员', time: '9月16日—9月22日' },
      { title: '学院初审与公示', desc: '学院评审委员会审核申请材料，确定推荐名单并在学院内公示', status: 'done', dept: '学院评审委员会', time: '9月23日—9月30日', material: '需公示不少于3个工作日' },
      { title: '学校评审', desc: '学生处汇总各学院推荐名单，组织校级评审委员会进行终审', status: 'pending', dept: '学生处', time: '10月1日—10月15日' },
      { title: '全校公示', desc: '评审结果在全校范围内公示，接受师生监督', status: 'pending', dept: '学生处', time: '10月16日—10月22日', material: '不少于5个工作日' },
      { title: '上报与发放', desc: '公示无异议后报教育部审批，获批后发放奖学金', status: 'pending', dept: '学生处、财务处', time: '11月—12月' }
    ]
  },
  {
    id: 2,
    route: '/service/major-transfer',
    title: '转专业',
    desc: '本科生转专业的申请条件、考核方式与审批流程',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F0F2EB, #E8ECE0)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    steps: [
      { title: '了解接收条件', desc: '查看目标学院官网公布的转专业接收计划、名额及考核要求', status: 'done', dept: '各学院', time: '提前1个月发布' },
      { title: '提交转专业申请', desc: '在教务系统提交转专业申请，上传成绩单及相关材料', status: 'done', dept: '教务处', time: '每学年第二学期第12-14周', material: '转专业申请表、成绩单、个人陈述' },
      { title: '学院审核', desc: '当前学院审核申请资格，确认是否同意转出', status: 'done', dept: '所在学院', time: '第15周' },
      { title: '接收学院考核', desc: '参加目标学院的笔试/面试考核，评估专业基础与综合能力', status: 'pending', dept: '接收学院', time: '第16周', material: '部分学院需参加专业基础测试' },
      { title: '结果公示', desc: '教务处汇总各学院录取名单，统一公示转专业结果', status: 'pending', dept: '教务处', time: '第17-18周' },
      { title: '办理手续', desc: '公示无异议后办理学籍异动手续，下学期正式转入新专业', status: 'pending', dept: '教务处、两学院', time: '公示后1周内' }
    ]
  },
  {
    id: 3,
    route: '/service/suspension',
    title: '休学复学',
    desc: '休学申请条件、复学办理流程及注意事项',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #EEF2F7, #E4EAF3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    steps: [
      { title: '提交休学申请', desc: '填写《休学申请表》，附相关证明材料提交至辅导员', status: 'done', dept: '所在学院', material: '休学申请表、身份证明、相关证明材料' },
      { title: '学院审批', desc: '辅导员及学院分管领导审核签字', status: 'done', dept: '学院学生工作办公室', time: '3-5个工作日' },
      { title: '部门审核', desc: '学生处或教务处审核休学材料', status: 'pending', dept: '学生处/教务处', time: '5个工作日' },
      { title: '办理离校手续', desc: '完成学费结算、宿舍退宿等离校手续', status: 'pending', dept: '财务处、后勤处', time: '审核通过后1周内' },
      { title: '提交复学申请', desc: '休学期满前一个月提交复学申请及相关证明', status: 'pending', dept: '所在学院', time: '休学期满前1个月', material: '复学申请表、相关证明' },
      { title: '复学报到', desc: '经审批同意后办理复学报到手续', status: 'pending', dept: '教务处', time: '每学期开学前' }
    ]
  },
  {
    id: 4,
    route: '/service/card-replacement',
    title: '校园卡补办',
    desc: '校园卡挂失、补办、解挂的快速办理通道',
    contact: '校园卡服务中心：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #FDF5F0, #FBEEE4)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    steps: [
      { title: '挂失', desc: '通过校园卡自助服务终端、校园APP或致电服务中心进行挂失', status: 'done', dept: '校园卡服务中心', time: '即时生效' },
      { title: '准备材料', desc: '携带本人身份证或学生证原件', status: 'done', material: '身份证或学生证' },
      { title: '前往服务中心', desc: '到校园卡服务中心窗口办理补办手续，缴纳工本费', status: 'pending', dept: '校园卡服务中心', time: '工作日 9:00-17:00', material: '工本费15元' },
      { title: '领取新卡', desc: '现场制卡，立等可取；原卡余额自动转入新卡', status: 'pending', dept: '校园卡服务中心', time: '当场领取' }
    ]
  },
  {
    id: 5,
    route: '/service/dorm-repair',
    title: '宿舍报修',
    desc: '宿舍设施故障在线报修，实时跟踪维修进度',
    contact: '后勤维修服务中心：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F0F4F8, #E6ECF3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    steps: [
      { title: '提交报修', desc: '通过线上报修平台或前往楼管值班室登记报修', status: 'done', dept: '宿舍楼值班室', material: '描述故障情况、宿舍号、联系方式' },
      { title: '派单', desc: '后勤调度中心根据报修类型分派维修人员', status: 'done', dept: '后勤调度中心', time: '报修后2小时内' },
      { title: '上门维修', desc: '维修人员联系报修人，约定时间上门维修', status: 'pending', dept: '后勤维修组', time: '一般故障24小时内' },
      { title: '验收确认', desc: '报修人检查维修结果，确认完成并评价服务', status: 'pending', time: '维修完成后即时确认' }
    ]
  },
  {
    id: 6,
    route: '/service/grade-cert',
    title: '成绩证明',
    desc: '中英文成绩单、在读证明、学籍证明的申请与打印',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F2F4EE, #E9ECE3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    steps: [
      { title: '在线申请', desc: '登录教务系统提交成绩单或在读证明申请', status: 'done', dept: '教务系统', time: '全天可申请' },
      { title: '缴费', desc: '在线支付证明材料费用（自助打印终端可直接缴费）', status: 'done', material: '中文版免费，英文版10元/份' },
      { title: '审核盖章', desc: '教务处审核申请信息，加盖公章', status: 'pending', dept: '教务处', time: '1-2个工作日' },
      { title: '领取/打印', desc: '前往自助打印终端或教务处窗口领取证明', status: 'pending', dept: '教务处/自助终端', time: '审核通过后随时领取' }
    ]
  }
]

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      if (heroBadgeRef.value) gsap.from(heroBadgeRef.value, { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' })
      if (heroTitleRef.value) gsap.from(heroTitleRef.value, { y: 24, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.08 })
      if (heroDescRef.value) gsap.from(heroDescRef.value, { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.15 })
      if (serviceGridRef.value) {
        const cards = serviceGridRef.value.querySelectorAll('.service-card')
        gsap.from(cards, {
          y: 24, opacity: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out', delay: 0.25
        })
      }
      // 底部插图：IntersectionObserver 替代 GSAP ScrollTrigger
      if (bottomIllustRef.value) {
        bottomIllustObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('footer-illust-visible')
              bottomIllustObserver.unobserve(entry.target)
            }
          },
          { rootMargin: '0px 0px -10% 0px' }
        )
        bottomIllustObserver.observe(bottomIllustRef.value)
      }
    })
  })
})

onUnmounted(() => { ctx?.revert(); bottomIllustObserver?.disconnect() })
</script>

<style scoped>
.service-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
}

.service-content {
  flex: 1;
  padding-top: var(--navbar-height);
}

/* ===== Hero ===== */
.service-hero {
  padding: 60px 0 40px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  box-shadow: var(--shadow-xs);
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--text-secondary);
}

/* ===== 卡片网格 ===== */
.service-main {
  padding-bottom: 80px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.service-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.card-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.card-info p {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-arrow {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.service-card:hover .card-arrow {
  transform: translateX(3px);
  color: var(--primary);
}

/* ===== 底部插图 ===== */
.service-footer {
  position: relative;
  height: 0;
  overflow: visible;
}

.footer-illust {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: block;
  opacity: 0;
  pointer-events: none;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.footer-illust-visible {
  opacity: 0.12;
  transform: translateY(0);
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .service-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 1.6rem;
  }
}
</style>
