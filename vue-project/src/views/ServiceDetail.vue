<template>
  <div class="detail-page">
    <Navbar />

    <div class="page-content">
      <div class="container">
        <button ref="backBtnRef" class="back-btn" @click="router.push('/service')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          返回办事大厅
        </button>

        <div ref="heroRef" class="page-hero">
          <div ref="heroIconRef" class="hero-icon" :style="{ background: svc.gradient }">
            <div v-html="svc.icon"></div>
          </div>
          <div>
            <h1>{{ svc.title }}</h1>
            <p>{{ svc.desc }}</p>
          </div>
          <button class="todo-add-btn" :class="{ added: inTodo }" @click="toggleTodo">
            <svg v-if="!inTodo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ inTodo ? '已加入待办' : '加入待办' }}
          </button>
        </div>

        <section class="content-section">
          <h2 ref="flowTitleRef" class="section-title">办理流程</h2>
          <div ref="timelineRef" class="timeline">
            <div v-for="(step, sIdx) in svc.steps" :key="sIdx" class="timeline-item">
              <div class="timeline-marker">
                <div class="marker-dot" :class="{ done: step.status === 'done' }">
                  <svg v-if="step.status === 'done'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else>{{ sIdx + 1 }}</span>
                </div>
                <div v-if="sIdx < svc.steps.length - 1" class="marker-line"></div>
              </div>
              <div class="timeline-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
                <div class="step-meta" v-if="step.dept || step.time || step.material">
                  <span v-if="step.dept" class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    {{ step.dept }}
                  </span>
                  <span v-if="step.time" class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ step.time }}
                  </span>
                  <span v-if="step.material" class="meta-item material">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {{ step.material }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-section">
          <h2 ref="contactTitleRef" class="section-title">联系方式</h2>
          <div ref="contactRef" class="contact-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>{{ svc.contact }}</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useTodoStore } from '../stores/todo'
import { gsap } from '../plugins/gsap'

const router = useRouter()
const route = useRoute()
const todoStore = useTodoStore()

const backBtnRef = ref(null)
const heroRef = ref(null)
const heroIconRef = ref(null)
const flowTitleRef = ref(null)
const timelineRef = ref(null)
const contactTitleRef = ref(null)
const contactRef = ref(null)
let ctx

const services = {
  scholarship: {
    title: '奖学金申请',
    desc: '国家奖学金、学业奖学金的申请条件、材料与审批流程',
    contact: '学生处奖助贷中心：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #FDF0E8, #FBE8D8)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    steps: [
      { title: '提交申请', desc: '填写《奖学金申请审批表》，附成绩单及获奖证明材料，提交至辅导员处', status: 'done', dept: '各学院学生工作办公室', time: '9月1日—9月15日', material: '申请表、成绩单、获奖证书复印件' },
      { title: '班级/专业评议', desc: '由辅导员组织班级或专业评议小组对申请人进行综合评定', status: 'done', dept: '辅导员', time: '9月16日—9月22日' },
      { title: '学院初审与公示', desc: '学院评审委员会审核申请材料，确定推荐名单并在学院内公示', status: 'done', dept: '学院评审委员会', time: '9月23日—9月30日', material: '需公示不少于3个工作日' },
      { title: '学校评审', desc: '学生处汇总各学院推荐名单，组织校级评审委员会进行终审', status: 'pending', dept: '学生处', time: '10月1日—10月15日' },
      { title: '全校公示', desc: '评审结果在全校范围内公示，接受师生监督', status: 'pending', dept: '学生处', time: '10月16日—10月22日', material: '不少于5个工作日' },
      { title: '上报与发放', desc: '公示无异议后报教育部审批，获批后发放奖学金', status: 'pending', dept: '学生处、财务处', time: '11月—12月' }
    ]
  },
  'major-transfer': {
    title: '转专业',
    desc: '本科生转专业的申请条件、考核方式与审批流程',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F0F2EB, #E8ECE0)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    steps: [
      { title: '了解接收条件', desc: '查看目标学院官网公布的转专业接收计划、名额及考核要求', status: 'done', dept: '各学院', time: '提前1个月发布' },
      { title: '提交转专业申请', desc: '在教务系统提交转专业申请，上传成绩单及相关材料', status: 'done', dept: '教务处', time: '每学年第二学期第12-14周', material: '转专业申请表、成绩单、个人陈述' },
      { title: '学院审核', desc: '当前学院审核申请资格，确认是否同意转出', status: 'done', dept: '所在学院', time: '第15周' },
      { title: '接收学院考核', desc: '参加目标学院的笔试/面试考核，评估专业基础与综合能力', status: 'pending', dept: '接收学院', time: '第16周', material: '部分学院需参加专业基础测试' },
      { title: '结果公示', desc: '教务处汇总各学院录取名单，统一公示转专业结果', status: 'pending', dept: '教务处', time: '第17-18周' },
      { title: '办理手续', desc: '公示无异议后办理学籍异动手续，下学期正式转入新专业', status: 'pending', dept: '教务处、两学院', time: '公示后1周内' }
    ]
  },
  suspension: {
    title: '休学复学',
    desc: '休学申请条件、复学办理流程及注意事项',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #EEF2F7, #E4EAF3)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    steps: [
      { title: '提交休学申请', desc: '填写《休学申请表》，附相关证明材料提交至辅导员', status: 'done', dept: '所在学院', material: '休学申请表、身份证明、相关证明材料' },
      { title: '学院审批', desc: '辅导员及学院分管领导审核签字', status: 'done', dept: '学院学生工作办公室', time: '3-5个工作日' },
      { title: '部门审核', desc: '学生处或教务处审核休学材料', status: 'pending', dept: '学生处/教务处', time: '5个工作日' },
      { title: '办理离校手续', desc: '完成学费结算、宿舍退宿等离校手续', status: 'pending', dept: '财务处、后勤处', time: '审核通过后1周内' },
      { title: '提交复学申请', desc: '休学期满前一个月提交复学申请及相关证明', status: 'pending', dept: '所在学院', time: '休学期满前1个月', material: '复学申请表、相关证明' },
      { title: '复学报到', desc: '经审批同意后办理复学报到手续', status: 'pending', dept: '教务处', time: '每学期开学前' }
    ]
  },
  'dorm-repair': {
    title: '宿舍报修',
    desc: '宿舍设施故障在线报修，实时跟踪维修进度',
    contact: '后勤维修服务中心：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F0F4F8, #E6ECF3)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    steps: [
      { title: '提交报修', desc: '通过线上报修平台或前往楼管值班室登记报修', status: 'done', dept: '宿舍楼值班室', material: '描述故障情况、宿舍号、联系方式' },
      { title: '派单', desc: '后勤调度中心根据报修类型分派维修人员', status: 'done', dept: '后勤调度中心', time: '报修后2小时内' },
      { title: '上门维修', desc: '维修人员联系报修人，约定时间上门维修', status: 'pending', dept: '后勤维修组', time: '一般故障24小时内' },
      { title: '验收确认', desc: '报修人检查维修结果，确认完成并评价服务', status: 'pending', time: '维修完成后即时确认' }
    ]
  },
  'grade-cert': {
    title: '成绩证明',
    desc: '中英文成绩单、在读证明、学籍证明的申请与打印',
    contact: '教务处学籍科：0591-2286XXXX',
    gradient: 'linear-gradient(135deg, #F2F4EE, #E9ECE3)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    steps: [
      { title: '在线申请', desc: '登录教务系统提交成绩单或在读证明申请', status: 'done', dept: '教务系统', time: '全天可申请' },
      { title: '缴费', desc: '在线支付证明材料费用（自助打印终端可直接缴费）', status: 'done', material: '中文版免费，英文版10元/份' },
      { title: '审核盖章', desc: '教务处审核申请信息，加盖公章', status: 'pending', dept: '教务处', time: '1-2个工作日' },
      { title: '领取/打印', desc: '前往自助打印终端或教务处窗口领取证明', status: 'pending', dept: '教务处/自助终端', time: '审核通过后随时领取' }
    ]
  }
}

// ---- 加入待办 ----
// 服务id → 待办标签映射
const TODO_CONFIG = {
  scholarship: { title: '奖学金申请', tag: '奖学金', deadline: '9月1日—9月15日', urgent: true },
  'major-transfer': { title: '转专业申请', tag: '教务', deadline: '每学年第二学期', urgent: false },
  suspension: { title: '休学复学办理', tag: '学籍', deadline: '按需办理', urgent: false },
  'dorm-repair': { title: '宿舍报修', tag: '后勤', deadline: '报修后24小时内', urgent: true },
  'grade-cert': { title: '成绩证明办理', tag: '教务', deadline: '按需办理', urgent: false }
}

const inTodo = computed(() => {
  const serviceId = route.params.id
  return todoStore.hasTodo('/service/' + serviceId, serviceId)
})

function toggleTodo() {
  const serviceId = route.params.id
  const route = '/service/' + serviceId
  if (inTodo.value) {
    const item = todoStore.items.find(t => t.serviceRoute === route && t.serviceId === serviceId && !t.done)
    if (item) todoStore.removeTodo(item.id)
  } else {
    const cfg = TODO_CONFIG[serviceId] || { title: svc.value.title, tag: '事务', deadline: '', urgent: false }
    todoStore.addTodo({
      title: cfg.title,
      tag: cfg.tag,
      deadline: cfg.deadline,
      urgent: cfg.urgent,
      serviceRoute: route,
      serviceId: serviceId
    })
  }
}

const svc = computed(() => {
  return services[route.params.id] || services.scholarship
})

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.out' } })

      tl.from(backBtnRef.value, { y: -12, opacity: 0, duration: 0.35 }, 0)
      tl.from(heroIconRef.value, { x: -20, opacity: 0, duration: 0.4 }, 0.06)
      tl.from(heroRef.value.querySelectorAll('h1, p'), { y: 16, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.1)
      tl.from(flowTitleRef.value, { y: 12, opacity: 0, duration: 0.35 }, 0.2)
      tl.from(timelineRef.value.querySelectorAll('.timeline-item'), { x: -16, opacity: 0, stagger: 0.08, duration: 0.45 }, 0.28)
      tl.from(contactTitleRef.value, { y: 12, opacity: 0, duration: 0.35 }, 0.4)
      tl.from(contactRef.value, { y: 12, opacity: 0, duration: 0.4 }, 0.45)
    })
  })
})

onUnmounted(() => { ctx?.revert() })
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--bg);
}

.page-content {
  padding-top: var(--navbar-height);
  padding-bottom: 80px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin-top: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--bg-warm);
}

.page-hero {
  margin: 32px 0 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.page-hero p {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.todo-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); font-size: 0.88rem; font-weight: 500;
  color: var(--text-secondary); cursor: pointer; font-family: inherit;
  transition: all var(--transition-fast); margin-left: auto; flex-shrink: 0;
}
.todo-add-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
.todo-add-btn.added { background: #E8F0E8; border-color: #6B9A6B; color: #4A8A4A; }
.todo-add-btn.added:hover { background: #D8E8D8; }

.content-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-light);
}

.timeline { padding-left: 4px; }

.timeline-item { display: flex; gap: 16px; }

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 28px;
}

.marker-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: var(--text-tertiary);
  font-size: 0.78rem;
  font-weight: 700;
  border: 2px solid var(--border);
  flex-shrink: 0;
}

.marker-dot.done {
  background: #E8F0E8;
  border-color: #6B9A6B;
  color: #4A8A4A;
}

.marker-line {
  width: 2px;
  flex: 1;
  min-height: 28px;
  background: var(--border-light);
  margin: 4px 0;
}

.timeline-content { padding-bottom: 24px; flex: 1; }

.step-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.step-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
}

.step-meta { display: flex; flex-wrap: wrap; gap: 8px; }

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: var(--bg-warm);
  border-radius: var(--radius-full);
  font-size: 0.73rem;
  color: var(--text-tertiary);
}

.meta-item.material { background: #FFF8E8; color: #8B7355; }

.contact-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .container { padding: 0 16px; }
  .page-hero { flex-direction: column; align-items: flex-start; gap: 12px; }
  .page-hero h1 { font-size: 1.5rem; }
}
</style>