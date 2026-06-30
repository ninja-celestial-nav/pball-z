import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Target, 
  Move, 
  Activity, 
  AlertTriangle, 
  Menu, 
  X,
  Star,
  BookOpen,
  ArrowRight,
  Swords,
  Feather,
  Hammer,
  Flame,
  Snowflake,
  Gift,
  Copy,
  Check,
  Globe
} from 'lucide-react';

// --- Data Structure: 雙語資料庫 ---
const TECHNIQUES = [
  {
    id: 'serve',
    title: { zh: '第一式：發球', en: 'Form I: The Serve' },
    subtitle: 'THE SERVE',
    icon: Flame,
    difficulty: 2,
    color: 'from-orange-600 to-red-600',
    glowColor: 'shadow-orange-500/50',
    philosophy: {
      zh: '戰鬥的序幕。目標不是一擊必殺，而是搶佔先機，壓制對手氣焰。',
      en: 'The prelude to battle. The goal is not an ace, but to seize the initiative and suppress the opponent\'s spirit.'
    },
    mnemonic: { zh: '放、推、指', en: 'Drop, Push, Point' },
    mnemonicDetail: {
      zh: '穩定放球，身體推送，隨揮指向目標。',
      en: 'Stable drop, body push, follow through to target.'
    },
    keyPoints: [
      { zh: '拋球要穩：不要拋高，在舒適高度放掉。', en: 'Stable Drop: Don\'t toss high, release at a comfortable height.' },
      { zh: '動力鏈：用轉腰和肩膀帶動，像打保齡球。', en: 'Kinetic Chain: Drive with hips and shoulders, like bowling.' },
      { zh: '合法性：下手擊球、擊球點低於腰部、拍頭朝下。', en: 'Legality: Underhand contact, below waist, paddle head down.' }
    ],
    tactics: [
      { type: 'safe', label: { zh: '中路深區', en: 'Deep Middle' }, desc: { zh: '最安全，容易造成對手溝通混亂。', en: 'Safest option, causes communication confusion.' } },
      { type: 'attack', label: { zh: '反手弱點', en: 'Backhand' }, desc: { zh: '針對對手反手拍深處施壓。', en: 'Pressure the opponent\'s backhand deep zone.' } },
      { type: 'risk', label: { zh: '避免淺球', en: 'Avoid Short' }, desc: { zh: '絕對不要發在廚房線附近的肉包球。', en: 'Never serve short near the kitchen line.' } }
    ],
    mistakes: [
      { zh: '拋球太高導致擊球點不穩', en: 'High toss causes unstable contact' },
      { zh: '手腕甩動太多導致出界', en: 'Too much wrist flick causes outs' },
      { zh: '想用力打快反而失誤', en: 'Forcing power leads to errors' }
    ],
    targetArea: 'baseline'
  },
  {
    id: 'return',
    title: { zh: '第二式：接發球', en: 'Form II: The Return' },
    subtitle: 'RETURN OF SERVE',
    icon: Move,
    difficulty: 2,
    color: 'from-blue-600 to-indigo-600',
    glowColor: 'shadow-blue-500/50',
    philosophy: {
      zh: '反擊的號角。任務是把球送深，爭取時間瞬間移動至前線。',
      en: 'The horn of counterattack. Send it deep to buy time for "Instant Transmission" to the net.'
    },
    mnemonic: { zh: '深、慢、衝', en: 'Deep, Slow, Run' },
    mnemonicDetail: {
      zh: '退步留空，推深打慢，隨球上網。',
      en: 'Step back, push deep/slow, run to the kitchen.'
    },
    keyPoints: [
      { zh: '預留空間：站在底線後1-2步，向前迎球。', en: 'Space: Stand 1-2 steps behind baseline, move forward.' },
      { zh: '動作精簡：縮短引拍，借力使力。', en: 'Compact: Short backswing, use the incoming pace.' },
      { zh: '打完就跑：擊球與啟動腳步是連續動作。', en: 'Hit & Run: Move to the NVZ immediately after contact.' }
    ],
    tactics: [
      { type: 'safe', label: { zh: '中路深處', en: 'Deep Middle' }, desc: { zh: '高弧度慢球，爭取最大上網時間。', en: 'Lofty slow ball to buy maximum time.' } },
      { type: 'attack', label: { zh: '針對弱者', en: 'Target Weakness' }, desc: { zh: '打向移動較慢或反手較差的對手。', en: 'Aim at the slower mover or weaker backhand.' } },
      { type: 'risk', label: { zh: '避免切大角度', en: 'Avoid Wide Angles' }, desc: { zh: '容易出界且打開自己的防守空檔。', en: 'Risky and opens up your own court.' } }
    ],
    mistakes: [
      { zh: '站在原地欣賞球（沒跑）', en: 'Admiring the shot (Not running)' },
      { zh: '回球太淺（給對手殺球機會）', en: 'Return too short (Easy kill for opponent)' },
      { zh: '引拍太大導致擊球點太晚', en: 'Backswing too large' }
    ],
    targetArea: 'baseline'
  },
  {
    id: 'drive',
    title: { zh: '第三式：抽球', en: 'Form III: The Drive' },
    subtitle: 'THE DRIVE',
    icon: Swords,
    difficulty: 3,
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'shadow-yellow-500/50',
    philosophy: {
      zh: '破防的重擊。迫使對手防禦崩潰，為終結技佈局。',
      en: 'The guard breaker. Force a defensive collapse to set up the finisher.'
    },
    mnemonic: { zh: '低、前、平、推', en: 'Low, Front, Flat, Push' },
    mnemonicDetail: {
      zh: '重心壓低，擊球點在前，水平推穿。',
      en: 'Stay low, contact in front, drive through horizontally.'
    },
    keyPoints: [
      { zh: '緊湊引拍：不要像網球一樣大拉拍。', en: 'Compact Load: No big tennis backswings.' },
      { zh: '水平揮拍：像推箱子一樣水平向前，減少上刷。', en: 'Level Swing: Push forward like moving a box.' },
      { zh: '身體發力：用腿和轉腰，不要只用手。', en: 'Body Power: Use legs and hips, not just arm.' }
    ],
    tactics: [
      { type: 'attack', label: { zh: '追身球/腋下', en: 'Body/Chicken Wing' }, desc: { zh: '瞄準對手身體，造成擠壓。', en: 'Jam the opponent, force a weak block.' } },
      { type: 'safe', label: { zh: '中路結合部', en: 'The Middle' }, desc: { zh: '兩人中間，製造搶球。', en: 'Confusion zone between players.' } },
      { type: 'attack', label: { zh: '反手拍', en: 'Backhand' }, desc: { zh: '測試對手反手擋快球的能力。', en: 'Test their backhand block stability.' } }
    ],
    mistakes: [
      { zh: '拉拍太大導致來不及', en: 'Late due to big backswing' },
      { zh: '過度手腕上刷導致掛網', en: 'Too much topspin into the net' },
      { zh: '擊球點太晚（被球擠到）', en: 'Contact point too late' }
    ],
    targetArea: 'body'
  },
  {
    id: 'drop',
    title: { zh: '第四式：掉球', en: 'Form IV: The Drop' },
    subtitle: '3RD SHOT DROP',
    icon: Feather,
    difficulty: 5,
    color: 'from-emerald-600 to-green-700',
    glowColor: 'shadow-emerald-500/50',
    philosophy: {
      zh: '存活的奧義。把激戰的快節奏轉化為控制的慢節奏。',
      en: 'The art of survival. Transform the chaos of speed into the control of patience.'
    },
    mnemonic: { zh: '軟、拋、墜', en: 'Soft, Lift, Drop' },
    mnemonicDetail: {
      zh: '放鬆握拍，由下提拉，過網即墜。',
      en: 'Relax grip, lift from below, drop over the net.'
    },
    keyPoints: [
      { zh: '由下往上：像拋玉米袋一樣的動作。', en: 'Low to High: Like tossing a cornhole bag.' },
      { zh: '利用拋物線：高點在自己這邊，過網急墜。', en: 'Use the Arc: Apex on your side, drops after net.' },
      { zh: '腳步穩：先站穩再打，打完再跟進。', en: 'Feet Set: Stop, hit, then move.' }
    ],
    tactics: [
      { type: 'safe', label: { zh: '中路廚房', en: 'Middle Kitchen' }, desc: { zh: '網子最低最安全。', en: 'Lowest part of the net, safest.' } },
      { type: 'attack', label: { zh: '對手反手', en: 'Opponent Backhand' }, desc: { zh: '考驗對手反手處理軟球的能力。', en: 'Test their soft game on the backhand.' } },
      { type: 'risk', label: { zh: '避免太深', en: 'Avoid Too Deep' }, desc: { zh: '落在廚房線附近容易被攻擊。', en: 'Near the NVZ line is attackable.' } }
    ],
    mistakes: [
      { zh: '手腕僵硬導致球過高', en: 'Stiff wrist pops the ball up' },
      { zh: '太想打貼網導致掛網', en: 'Trying too hard for perfect height' },
      { zh: '邊跑邊打導致控球不穩', en: 'Running while hitting' }
    ],
    targetArea: 'kitchen'
  },
  {
    id: 'dink',
    title: { zh: '第五式：丁克球', en: 'Form V: The Dink' },
    subtitle: 'DINKING',
    icon: Activity,
    difficulty: 4,
    color: 'from-purple-600 to-fuchsia-700',
    glowColor: 'shadow-purple-500/50',
    philosophy: {
      zh: '心智的博弈。比的是耐心，誰先急躁誰就輸了。',
      en: 'The mind game. A battle of patience; he who rushes, loses.'
    },
    mnemonic: { zh: '低、鎖、前、柔', en: 'Low, Lock, Front, Soft' },
    mnemonicDetail: {
      zh: '重心低，鎖手腕，前點打，手感柔。',
      en: 'Stay low, lock wrist, contact front, soft touch.'
    },
    keyPoints: [
      { zh: '肩膀主導：鎖住手腕，用肩膀輕推。', en: 'Shoulder Driven: Lock wrist, push with shoulder.' },
      { zh: '視線水平：蹲低，讓眼睛接近球的高度。', en: 'Eye Level: Get low, see the ball clearly.' },
      { zh: '死守廚房線：不要輕易後退。', en: 'Hold the Line: Don\'t retreat easily.' }
    ],
    tactics: [
      { type: 'safe', label: { zh: '斜對角', en: 'Crosscourt' }, desc: { zh: '網子最低，距離最長，容錯率高。', en: 'Lowest net, longest distance, forgiving.' } },
      { type: 'attack', label: { zh: '腳邊', en: 'Feet' }, desc: { zh: '推深一點，瞄準對手鞋帶。', en: 'Push deep, aim for shoelaces.' } },
      { type: 'risk', label: { zh: '避免過多直線', en: 'Avoid Straight' }, desc: { zh: '網子高且容易被快攻。', en: 'Higher net and easy to speed up.' } }
    ],
    mistakes: [
      { zh: '亂甩手腕', en: 'Flicking the wrist' },
      { zh: '身體站太直', en: 'Standing too tall' },
      { zh: '握拍太緊導致無法卸力', en: 'Death grip on paddle' }
    ],
    targetArea: 'kitchen_feet'
  },
  {
    id: 'volley',
    title: { zh: '第六式：截擊', en: 'Form VI: The Volley' },
    subtitle: 'THE VOLLEY',
    icon: Shield,
    difficulty: 3,
    color: 'from-rose-600 to-red-700',
    glowColor: 'shadow-rose-500/50',
    philosophy: {
      zh: '銅牆鐵壁。剝奪對手的時間，將攻勢化為烏有。',
      en: 'The Iron Wall. Steal the opponent\'s time and nullify their offense.'
    },
    mnemonic: { zh: '舉、前、短、刺', en: 'Up, Front, Short, Punch' },
    mnemonicDetail: {
      zh: '拍子舉好，前點攔截，動作短促，像刺拳。',
      en: 'Paddle up, intercept early, short motion, jab.'
    },
    keyPoints: [
      { zh: '拍子舉高：永遠置於胸口前方準備。', en: 'Paddle Up: Always ready at chest height.' },
      { zh: '沒有引拍：不要向後拉，直接向前推。', en: 'No Backswing: Don\'t pull back, just push.' },
      { zh: '借力使力：面對快球只需架好擋回去。', en: 'Block: Use their pace against them.' }
    ],
    tactics: [
      { type: 'defend', label: { zh: '擋球 (Block)', en: 'Block' }, desc: { zh: '卸力擋回深處。', en: 'Absorb pace, return deep.' } },
      { type: 'attack', label: { zh: '推擊 (Punch)', en: 'Punch Volley' }, desc: { zh: '瞄準空檔或腳邊加壓。', en: 'Punch to open court or feet.' } }
    ],
    mistakes: [
      { zh: '網球式大拉拍', en: 'Big tennis swing' },
      { zh: '拍子垂下來（太懶惰）', en: 'Paddle down (Lazy)' },
      { zh: '遇到快球就恐慌後退', en: 'Retreating in panic' }
    ],
    targetArea: 'open_court'
  },
  {
    id: 'reset',
    title: { zh: '奧義：重置球', en: 'Secret Tech: The Reset' },
    subtitle: 'THE RESET',
    icon: Snowflake,
    difficulty: 5,
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'shadow-cyan-500/50',
    philosophy: {
      zh: '以柔克剛的滅火器。吸收能量，將快球變軟球。',
      en: 'The extinguisher. Softness overcomes hardness. Absorb energy, reset the point.'
    },
    mnemonic: { zh: '鬆、擋、吸、落', en: 'Loose, Block, Absorb, Drop' },
    mnemonicDetail: {
      zh: '握拍鬆，架拍擋，吸衝力，落廚房。',
      en: 'Loose grip, block path, absorb shock, drop in kitchen.'
    },
    keyPoints: [
      { zh: '握拍極鬆：只有2-3分力，像拿生雞蛋。', en: 'Loose Grip: 2-3/10 pressure, like holding an egg.' },
      { zh: '沒有揮拍：只是把拍子放在路徑上。', en: 'No Swing: Just place the paddle in the way.' },
      { zh: '重心極低：紮好馬步保持穩定。', en: 'Low Stance: Stable base is crucial.' }
    ],
    tactics: [
      { type: 'defend', label: { zh: '過渡區', en: 'Transition Zone' }, desc: { zh: '被打腳邊時使用。', en: 'Use when attacked at your feet.' } },
      { type: 'defend', label: { zh: '網前', en: 'At the Net' }, desc: { zh: '失誤回高時蹲低防守。', en: 'Defend low when you pop it up.' } }
    ],
    mistakes: [
      { zh: '握太緊導致球彈飛', en: 'Grip too tight (Pop up)' },
      { zh: '試圖揮拍控制', en: 'Trying to swing' },
      { zh: '拍面太垂直導致掛網', en: 'Paddle face too closed' }
    ],
    targetArea: 'kitchen'
  },
  {
    id: 'smash',
    title: { zh: '終結技：殺球', en: 'Finisher: The Smash' },
    subtitle: 'OVERHEAD SMASH',
    icon: Hammer,
    difficulty: 3,
    color: 'from-gray-700 to-black',
    glowColor: 'shadow-white/20',
    philosophy: {
      zh: '毀滅的一擊。位置比力量重要，腳步決定成敗。',
      en: 'Destruction. Position over power; footwork decides the outcome.'
    },
    mnemonic: { zh: '側、指、高、扣', en: 'Turn, Point, High, Snap' },
    mnemonicDetail: {
      zh: '側身後退，手指瞄準，高點擊球，手腕下扣。',
      en: 'Turn side, point hand, reach high, wrist snap.'
    },
    keyPoints: [
      { zh: '側身跑：絕對不要倒退嚕。', en: 'Turn & Run: Never backpedal.' },
      { zh: '獎盃姿勢：架拍拉弓，手肘抬高。', en: 'Trophy Pose: Elbow up, bow drawn.' },
      { zh: '手腕下壓：確保球向下飛行。', en: 'Wrist Snap: Ensure downward trajectory.' }
    ],
    tactics: [
      { type: 'attack', label: { zh: '對手腳邊', en: 'Opponent Feet' }, desc: { zh: '最難防守的位置。', en: 'Hardest spot to defend.' } },
      { type: 'attack', label: { zh: '場地空檔', en: 'Open Court' }, desc: { zh: '瞄準無人區域。', en: 'Aim where they are not.' } }
    ],
    mistakes: [
      { zh: '球在腦後擊球（出界）', en: 'Contact behind head (Out)' },
      { zh: '手肘太低變成推球', en: 'Elbow too low (Pushing)' },
      { zh: '用力過猛打在網帶上', en: 'Overpowering into the net' }
    ],
    targetArea: 'feet'
  }
];

// --- UI Strings ---
const UI = {
  powerLevel: { zh: '戰鬥力', en: 'Power Level' },
  mantra: { zh: '修煉口訣', en: 'Battle Mantra' },
  radar: { zh: '戰術雷達分析', en: 'Tactical Radar' },
  techniqueFocus: { zh: '技術動作重點', en: 'Technique Focus' },
  strategy: { zh: '戰術策略', en: 'Tactical Strategy' },
  taboos: { zh: '戰鬥禁忌', en: 'Combat Taboos' },
  nextLevel: { zh: '進入下一章修煉', en: 'Next Level Training' },
  complete: { zh: '完成修煉 (隨喜贊助)', en: 'Training Complete (Donate)' },
  safe: { zh: '安全首選', en: 'SAFE OPTION' },
  risk: { zh: '高風險', en: 'HIGH RISK' },
  attack: { zh: '進攻', en: 'ATTACK' },
  defend: { zh: '防守', en: 'DEFEND' },
  readComic: { zh: '<看漫畫>', en: '<Read Comic>' },
  modalTitle: { zh: '修煉完成！', en: 'Training Complete!' },
  modalDesc: { 
    zh: '恭喜你掌握了所有賽亞人匹克球奧義！<br/>若覺得這本手冊有幫助，歡迎隨喜贊助。', 
    en: 'Congratulations on mastering the Saiyan Pickleball Arts! <br/>If this manual helped, donations are welcome.' 
  },
  jkCode: { zh: '街口代碼', en: 'JKOPay Code' },
  jkAcct: { zh: '街口帳號', en: 'Account No.' },
  copied: { zh: '已複製帳號！', en: 'Copied!' },
  close: { zh: '關閉', en: 'Close' },
  zoneDeep: { zh: '深區壓制', en: 'Deep Zone' },
  zoneNVZ: { zh: 'NVZ 落點', en: 'NVZ Target' },
  zoneBody: { zh: '追身球', en: 'Body Shot' },
  zoneOpen: { zh: '空檔', en: 'Open Court' }
};

// --- Sub-components ---

const DifficultyStars = ({ level }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className={`${i < level ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-gray-700'} transform transition-all duration-300 hover:scale-125`} 
        />
      ))}
    </div>
  );
};

const TargetLock = ({ label, color }) => (
  <div className="relative flex items-center justify-center w-full h-full">
     <div className={`absolute w-4 h-4 border-t-2 border-l-2 ${color} border-opacity-70 top-2 left-2`}></div>
     <div className={`absolute w-4 h-4 border-t-2 border-r-2 ${color} border-opacity-70 top-2 right-2`}></div>
     <div className={`absolute w-4 h-4 border-b-2 border-l-2 ${color} border-opacity-70 bottom-2 left-2`}></div>
     <div className={`absolute w-4 h-4 border-b-2 border-r-2 ${color} border-opacity-70 bottom-2 right-2`}></div>
     <span className={`${color} font-mono text-[10px] bg-[#020617]/80 px-2 py-1 rounded border border-current opacity-80 tracking-widest drop-shadow-md`}>{label}</span>
  </div>
);

const CourtVisual = ({ activeTechnique, lang }) => {
  const getTrajectory = (techId) => {
    switch(techId) {
      case 'serve': return { startX: '65%', startY: '5%', endX: '30%', endY: '82%', duration: '1.2s', scaleMax: 1.4, isFlat: false, rivalX: '50%' };
      case 'return': return { startX: '65%', startY: '5%', endX: '50%', endY: '82%', duration: '1.8s', scaleMax: 1.8, isFlat: false, rivalX: '50%' };
      case 'drive': return { startX: '50%', startY: '20%', endX: '50%', endY: '75%', duration: '0.6s', scaleMax: 1.0, isFlat: true, rivalX: '50%' };
      case 'drop': return { startX: '50%', startY: '20%', endX: '50%', endY: '58%', duration: '1.6s', scaleMax: 1.6, isFlat: false, rivalX: '50%' };
      case 'dink': return { startX: '50%', startY: '33%', endX: '75%', endY: '58%', duration: '1.2s', scaleMax: 1.3, isFlat: false, rivalX: '50%' };
      case 'volley': return { startX: '50%', startY: '33%', endX: '72%', endY: '67%', duration: '0.4s', scaleMax: 1.0, isFlat: true, rivalX: '50%' };
      case 'reset': return { startX: '50%', startY: '25%', endX: '50%', endY: '58%', duration: '1.8s', scaleMax: 1.4, isFlat: false, rivalX: '50%' };
      default: return { startX: '50%', startY: '10%', endX: '50%', endY: '75%', duration: '1s', scaleMax: 1.2, isFlat: false, rivalX: '50%' };
    }
  };
  const traj = getTrajectory(activeTechnique.id);

  return (
    <div className="relative w-full aspect-[20/44] bg-[#020617] rounded-lg border-2 border-cyan-500/40 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center">
       
       {/* Radar Sweeping Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
       <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]"
            style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(6,182,212,0.3) 100%)' }}></div>
       
       {/* Concentric Radar Rings */}
       <div className="absolute w-[40%] h-[20%] border border-cyan-500/20 rounded-full"></div>
       <div className="absolute w-[80%] h-[40%] border border-cyan-500/20 rounded-full"></div>
       <div className="absolute w-[120%] h-[60%] border border-cyan-500/20 rounded-full"></div>

       {/* Court Neon Grid Lines */}
       <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"></div>
       <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-20 flex items-center justify-center">
          <div className="bg-[#020617] text-cyan-400 px-2 text-[10px] font-mono border border-cyan-500/50 rounded shadow-[0_0_5px_rgba(6,182,212,0.5)]">NET</div>
       </div>
       
       {/* NVZ Lines */}
       <div className="absolute top-[35%] left-[10%] right-[10%] h-[1px] bg-cyan-500/40"></div>
       <div className="absolute bottom-[35%] left-[10%] right-[10%] h-[1px] bg-cyan-500/40"></div>
       
       {/* Centerlines */}
       <div className="absolute top-[10%] bottom-[65%] left-1/2 w-[1px] bg-cyan-500/40 transform -translate-x-1/2"></div>
       <div className="absolute top-[65%] bottom-[10%] left-1/2 w-[1px] bg-cyan-500/40 transform -translate-x-1/2"></div>

       {/* Rival blip */}
       <div className="absolute top-2 transform -translate-x-1/2 z-20 text-center transition-all duration-500" style={{ left: traj.rivalX }}>
          <span className="text-cyan-500 font-black text-xl uppercase tracking-widest opacity-40 select-none">Rival</span>
       </div>

       {/* Animated Ball Trajectory */}
       <div 
          key={activeTechnique.id}
          className="absolute w-3 h-3 z-30 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: `ball-shoot ${traj.duration} infinite cubic-bezier(0.25, 1, 0.5, 1)`,
            '--start-x': traj.startX,
            '--start-y': traj.startY,
            '--end-x': traj.endX,
            '--end-y': traj.endY
          }}
       >
         <div 
           className="absolute top-0 left-0 w-full h-full bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,1)]"
           style={{
             animation: traj.isFlat ? 'none' : `ball-arc ${traj.duration} infinite cubic-bezier(0.25, 1, 0.5, 1)`,
             '--scale-max': traj.scaleMax
           }}
         >
           <div className="absolute top-0 left-0 w-full h-full bg-orange-400 rounded-full animate-ping opacity-50"></div>
         </div>
       </div>

       {/* Highlight Zones with Target Lock-on */}
       {activeTechnique.targetArea === 'baseline' && activeTechnique.id === 'serve' && (
         <div className="absolute top-[10%] left-[10%] right-[50%] h-[15%] bg-red-500/20 border border-red-500/50 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-[1px]">
            <TargetLock label={UI.zoneDeep[lang]} color="text-red-400" />
         </div>
       )}
       
       {activeTechnique.targetArea === 'baseline' && activeTechnique.id === 'return' && (
         <div className="absolute top-[10%] left-[10%] right-[10%] h-[15%] bg-red-500/20 border border-red-500/50 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-[1px]">
            <TargetLock label={UI.zoneDeep[lang]} color="text-red-400" />
         </div>
       )}

       {['kitchen', 'kitchen_feet'].includes(activeTechnique.targetArea) && (
          <div className="absolute top-[35%] bottom-[50%] left-[10%] right-[10%] bg-green-500/20 border border-green-500/50 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-[1px]">
             <TargetLock label={UI.zoneNVZ[lang]} color="text-green-400" />
          </div>
       )}

       {activeTechnique.targetArea === 'body' && (
          <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
             <div className="absolute w-20 h-20 border-2 border-yellow-500/40 rounded-full animate-[spin_3s_linear_infinite]"></div>
             <div className="absolute w-12 h-12 border-2 border-yellow-400 border-dashed rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
             <div className="bg-yellow-500/20 p-2 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.4)]">
               <Target size={24} className="text-yellow-400" />
             </div>
             <div className="absolute top-full mt-2 whitespace-nowrap bg-[#020617]/80 text-yellow-400 text-[10px] px-2 py-0.5 rounded border border-yellow-500/50">
                {UI.zoneBody[lang]}
             </div>
          </div>
       )}

       {['feet', 'kitchen_feet'].includes(activeTechnique.targetArea) && (
          <div className="absolute top-[33%] left-[20%] right-[20%] h-4 bg-purple-500/40 blur-[2px] animate-pulse z-10 rounded-[100%] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
       )}

       {activeTechnique.targetArea === 'open_court' && (
          <div className="absolute top-[15%] left-[55%] right-[10%] h-[35%] bg-blue-500/20 border-2 border-blue-400/60 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-[1px]">
             <div className="absolute w-3 h-3 border-t-2 border-l-2 border-blue-400 top-0 left-0"></div>
             <div className="absolute w-3 h-3 border-t-2 border-r-2 border-blue-400 top-0 right-0"></div>
             <div className="absolute w-3 h-3 border-b-2 border-l-2 border-blue-400 bottom-0 left-0"></div>
             <div className="absolute w-3 h-3 border-b-2 border-r-2 border-blue-400 bottom-0 right-0"></div>
             <span className="text-blue-300 font-mono text-[10px] bg-[#020617]/80 px-2 py-1 rounded border border-blue-500/30 tracking-widest">{UI.zoneOpen[lang]}</span>
          </div>
       )}

       {/* YOU radar blip */}
       <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500" style={{ left: traj.startX, bottom: traj.startY }}>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 border border-orange-500/50 rounded-full animate-ping"></div>
            <div className="absolute w-8 h-8 border border-orange-500/80 rounded-full animate-pulse"></div>
            <div className="bg-[#020617] text-orange-400 w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.8)] border border-orange-500">
               <div className="w-1.5 h-1.5 bg-orange-300 rounded-full shadow-[0_0_5px_#fff]"></div>
            </div>
          </div>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-orange-400 font-mono tracking-widest font-bold">YOU</div>
       </div>
    </div>
  );
};

const MnemonicCard = ({ mnemonic, detail, color, glowColor, lang }) => (
  <div className={`relative rounded-xl overflow-hidden transform transition hover:scale-[1.02] duration-300 bg-slate-800 border border-slate-700 shadow-xl group`}>
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${color}`}></div>
    
    <div className={`bg-gradient-to-r ${color} p-4 text-white text-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <h3 className="text-lg font-bold tracking-widest uppercase relative z-10 flex items-center justify-center gap-2">
        <Star size={16} className="text-yellow-300" />
        {UI.mantra[lang]}
        <Star size={16} className="text-yellow-300" />
      </h3>
    </div>
    
    <div className="p-8 text-center relative z-10">
      <div className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${color} tracking-[0.1em] mb-4 font-sans drop-shadow-sm`}>
        {mnemonic[lang]}
      </div>
      <p className="text-slate-400 text-sm font-medium border-t border-slate-700 pt-4 mt-2">{detail[lang]}</p>
    </div>
  </div>
);

const DonationModal = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  const jkCode = "396";
  const jkAccount = "900313205";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jkAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-slate-900 border-2 border-orange-500 rounded-3xl w-full max-w-sm md:max-w-md p-6 md:p-8 shadow-[0_0_50px_rgba(249,115,22,0.3)] animate-bounce-in overflow-hidden transform transition-all">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-yellow-400"></div>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/30"></div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full shadow-lg relative z-10">
                <Gift size={40} className="text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white mb-2">{UI.modalTitle[lang]}</h2>
            <p className="text-slate-400 text-sm" dangerouslySetInnerHTML={{ __html: UI.modalDesc[lang] }} />
          </div>

          <div className="relative group mx-auto bg-white rounded-xl p-2 max-w-[280px] shadow-2xl justify-center flex">
            <img 
              src="https://i.meee.com.tw/7xjgtf4.jpg" 
              alt="街口支付 QR Code" 
              className="w-full h-auto rounded-lg relative z-0"
            />
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between text-sm mb-2">
               <span className="text-slate-400">{UI.jkCode[lang]}</span>
               <span className="font-mono font-bold text-orange-400">{jkCode}</span>
            </div>
            <div className="flex items-center justify-between text-sm bg-slate-950 p-3 rounded-lg border border-slate-800 group cursor-pointer" onClick={handleCopy}>
               <span className="text-slate-400">{UI.jkAcct[lang]}</span>
               <div className="flex items-center gap-2">
                 <span className="font-mono font-bold text-white tracking-wider">{jkAccount}</span>
                 {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-500 group-hover:text-white transition-colors" />}
               </div>
            </div>
            {copied && <p className="text-xs text-green-500 mt-2 text-center animate-fade-in">{UI.copied[lang]}</p>}
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl border border-slate-700 transition-colors"
          >
            {UI.close[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('serve');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  
  const [lang, setLang] = useState(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || navigator.userLanguage;
      return browserLang && browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    }
    return 'zh';
  });
  
  const scrollContainerRef = useRef(null);

  const activeTechnique = TECHNIQUES.find(t => t.id === activeTab) || TECHNIQUES[0];
  const activeIndex = TECHNIQUES.findIndex(t => t.id === activeTab);
  const isLastChapter = activeIndex === TECHNIQUES.length - 1;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const handleNextClick = () => {
    if (isLastChapter) {
      setShowDonation(true);
    } else {
      const nextIndex = (activeIndex + 1) % TECHNIQUES.length;
      setActiveTab(TECHNIQUES[nextIndex].id);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex overflow-hidden selection:bg-orange-500 selection:text-white">
      
      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} lang={lang} />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 bg-slate-900 border-b border-slate-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 drop-shadow-[0_2px_4px_rgba(234,88,12,0.5)]">
                      P.BALL Z
                    </h1>
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold mt-1 tracking-widest uppercase">Saiyan Training Manual</p>
                </div>
                <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                 <a 
                    href="https://photos.app.goo.gl/93W3aoniqed4yGta7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-600 hover:text-orange-400 transition-colors cursor-pointer no-underline font-normal tracking-tight"
                  >
                    {UI.readComic[lang]}
                  </a>
                  
                  <button 
                    onClick={toggleLang} 
                    className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full border border-slate-700 hover:border-orange-500 transition-colors"
                  >
                    <Globe size={12} className="text-slate-400" />
                    <span className={`text-[10px] font-bold ${lang === 'en' ? 'text-orange-400' : 'text-slate-500'}`}>EN</span>
                    <span className="text-[10px] text-slate-600">/</span>
                    <span className={`text-[10px] font-bold ${lang === 'zh' ? 'text-orange-400' : 'text-slate-500'}`}>中</span>
                  </button>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 space-y-2 px-3 custom-scrollbar">
            {TECHNIQUES.map((tech) => (
              <button
                key={tech.id}
                onClick={() => {
                  setActiveTab(tech.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden
                  ${activeTab === tech.id 
                    ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300 border border-transparent'}
                `}
              >
                {activeTab === tech.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_#f97316]"></div>
                )}
                
                <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${activeTab === tech.id ? 'bg-orange-500/10 text-orange-400 scale-110' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                  <tech.icon size={20} />
                </div>
                <div className="text-left">
                  <span className={`block text-sm font-bold tracking-wide ${activeTab === tech.id ? 'text-gray-100' : ''}`}>{tech.title[lang]}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
             <p className="text-[10px] text-slate-600 uppercase tracking-widest">Kame Style • Pickleball Arts</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        
        <header className="lg:hidden bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-slate-400 p-1 hover:text-white">
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-200 tracking-wide">{lang === 'zh' ? '戰鬥力探測器' : 'Scouter'}</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={toggleLang} 
                className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 active:scale-95 transition-transform"
              >
                <span className={`text-xs font-bold ${lang === 'en' ? 'text-orange-400' : 'text-slate-500'}`}>EN</span>
                <span className={`text-xs font-bold ${lang === 'zh' ? 'text-orange-400' : 'text-slate-500'}`}>中</span>
              </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg animate-pulse"></div>
          </div>
        </header>

        {/* Fixed Floating Donation Button — non-intrusive, avoids sidebar */}
        <button
          onClick={() => setShowDonation(true)}
          className="fixed bottom-5 left-4 lg:left-[19.5rem] z-40 group flex items-center gap-0 hover:gap-2 bg-slate-800/80 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 backdrop-blur-md text-orange-400 hover:text-white border border-slate-700 hover:border-orange-500/50 font-bold p-3 hover:px-5 hover:py-3 rounded-full shadow-lg hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          title={lang === 'zh' ? '隨喜贊助' : 'Donate'}
        >
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/40 animate-ping pointer-events-none" />
          <div className="absolute -inset-1 rounded-full bg-orange-500/15 animate-pulse pointer-events-none" />
          <Gift size={18} className="relative flex-shrink-0 transform group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative max-w-0 overflow-hidden group-hover:max-w-[6rem] whitespace-nowrap text-sm transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
            {lang === 'zh' ? '隨喜贊助' : 'Donate'}
          </span>
        </button>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 scroll-smooth custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className={`rounded-3xl p-8 lg:p-12 text-white shadow-2xl bg-gradient-to-br ${activeTechnique.color} relative overflow-hidden border border-white/10`}>
              <div className="absolute -right-20 -bottom-20 text-white/10 transform -rotate-12 animate-pulse-slow">
                 <activeTechnique.icon size={300} />
              </div>
              
              <div className="absolute top-0 right-0 p-32 bg-white/5 blur-3xl rounded-full mix-blend-overlay"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                  <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white/90">
                    <BookOpen size={14} /> 
                    <span className="tracking-widest uppercase">Chapter 0{activeIndex + 1}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{UI.powerLevel[lang]}</span>
                    <DifficultyStars level={activeTechnique.difficulty} />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter drop-shadow-lg">{activeTechnique.title[lang]}</h2>
                <h3 className="text-xl md:text-2xl font-bold text-white/80 mb-8 font-mono tracking-widest">{activeTechnique.subtitle}</h3>
                
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-white/30"></div>
                  <p className="text-lg md:text-2xl leading-relaxed max-w-3xl font-medium text-white/90 pl-6 italic">
                    "{activeTechnique.philosophy[lang]}"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              
              <div className="lg:col-span-4 space-y-6">
                <MnemonicCard 
                  mnemonic={activeTechnique.mnemonic} 
                  detail={activeTechnique.mnemonicDetail}
                  color={activeTechnique.color}
                  glowColor={activeTechnique.glowColor}
                  lang={lang}
                />
                
                <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
                  <h4 className="font-bold text-slate-200 mb-6 flex items-center gap-2 tracking-wide uppercase text-sm border-b border-slate-700 pb-2">
                    <Target size={16} className="text-red-500" />
                    {UI.radar[lang]}
                  </h4>
                  <CourtVisual activeTechnique={activeTechnique} lang={lang} />
                  <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>You</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600 border border-slate-400"></span>Rival</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                
                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden hover:border-orange-500/30 transition-colors duration-300">
                  <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="p-1.5 bg-orange-500/20 rounded text-orange-500">
                      <Zap size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-200 tracking-wide">
                      {UI.techniqueFocus[lang]}
                    </h3>
                  </div>
                  <div className="p-6 md:p-8">
                    <ul className="space-y-6">
                      {activeTechnique.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-4 group">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-orange-500 flex items-center justify-center flex-shrink-0 font-black text-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg">
                            {idx + 1}
                          </div>
                          <span className="text-slate-300 font-medium text-lg pt-0.5 group-hover:text-slate-100 transition-colors">{point[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                  <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded text-blue-500">
                      <Shield size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-200 tracking-wide">
                      {UI.strategy[lang]}
                    </h3>
                  </div>
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeTechnique.tactics.map((tactic, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        tactic.type === 'safe' ? 'bg-emerald-900/20 border-emerald-800 hover:border-emerald-500/50' :
                        tactic.type === 'risk' ? 'bg-red-900/20 border-red-800 hover:border-red-500/50' :
                        'bg-blue-900/20 border-blue-800 hover:border-blue-500/50'
                      }`}>
                        <div className={`text-[10px] font-black uppercase mb-2 tracking-widest ${
                           tactic.type === 'safe' ? 'text-emerald-400' :
                           tactic.type === 'risk' ? 'text-red-400' :
                           'text-blue-400'
                        }`}>
                          {tactic.type === 'safe' ? UI.safe[lang] : tactic.type === 'risk' ? UI.risk[lang] : tactic.type === 'attack' ? UI.attack[lang] : UI.defend[lang]}
                        </div>
                        <h5 className="font-bold text-slate-100 mb-2 text-lg">{tactic.label[lang]}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed">{tactic.desc[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                   <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="p-1.5 bg-red-500/20 rounded text-red-500">
                      <AlertTriangle size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-200 tracking-wide">
                      {UI.taboos[lang]}
                    </h3>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-3">
                      {activeTechnique.mistakes.map((mistake, idx) => (
                        <span key={idx} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20 flex items-center gap-2 hover:bg-red-500/20 transition-colors">
                          <X size={14} /> {mistake[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end mt-12 mb-8">
               <button 
                 onClick={handleNextClick}
                 className={`group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-slate-900 
                  ${isLastChapter 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 focus:ring-orange-500' 
                    : 'bg-orange-600 hover:bg-orange-500 focus:ring-orange-600'
                  }`}
               >
                 <span className="mr-2">
                    {isLastChapter ? UI.complete[lang] : UI.nextLevel[lang]}
                 </span>
                 {isLastChapter ? <Gift size={20} className="transform group-hover:scale-110 transition-transform" /> : <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />}
                 
                 <div className={`absolute -inset-3 rounded-full opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200 ${isLastChapter ? 'bg-yellow-400' : 'bg-orange-400'}`} />
               </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
