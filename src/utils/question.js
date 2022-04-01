// 单选题模拟数据 type:1
export const singleQuestionData = [
  {
    type: 1,
    fraction: 1,
    title: '1（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 256,
    allAnswerCorrectRate: 86,
    fallibility: 2,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
  {
    type: 1,
    fraction: 1,
    title: '2（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 2,
    allAnswerNum: 256,
    allAnswerCorrectRate: 86,
    fallibility: 3,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
  {
    type: 1,
    fraction: 2,
    title: '3（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法s治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领s导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 3,
    allAnswerNum: 123,
    allAnswerCorrectRate: 90,
    fallibility: 4,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
]

// 多选题模拟数据 type:2
export const severalQuestionData = [
  {
    type: 2,
    fraction: 2,
    title: '社会主义法制理念的基本内涵包括（）。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: [],
    answerTime: '',
    okAnswer: [1,2,3],
    allAnswerNum: 128,
    allAnswerCorrectRate: 93,
    fallibility: [2,3],
    analysis: '依法治国、执法为民、公平正义、服务大局、党的领导',
    isShowQuestionAnalysis: false,
  },
  {
    type: 2,
    fraction: 20,
    title: '社会主义法制理念的基本内涵包括（）。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: [],
    answerTime: '',
    okAnswer: [1,2],
    allAnswerNum: 128,
    allAnswerCorrectRate: 93,
    fallibility: [2,3],
    analysis: '依法治国、执法为民、公平正义、服务大局、党的领导',
    isShowQuestionAnalysis: false,
  },
]

// 判断题模拟数据 type:3
export const judgeQuestionData = [
  {
    type: 3,
    fraction: 1,
    title: '依法治国是社会主义法制的核心内容，是我们党领导人民治理国家的基本方略。',
    isCollect: false,
    answerList: [
      {value: 1, label: '正确', isChecked: false},
      {value: 2, label: '错误', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 128,
    allAnswerCorrectRate: 93,
    fallibility: 2,
    analysis: '《社会主义法治理念读本》第五章一、依法治国是社会主义法制的核心内容',
    isShowQuestionAnalysis: false,
  },
  {
    type: 3,
    fraction: 1,
    title: '人民是依法治国的主体和力量源泉，必须坚持人民主体地位。',
    isCollect: false,
    answerList: [
      {value: 1, label: '正确', isChecked: false},
      {value: 2, label: '错误', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 512,
    allAnswerCorrectRate: 99,
    fallibility: 2,
    analysis: '略',
    isShowQuestionAnalysis: false,
  },
  {
    type: 3,
    fraction: 1,
    title: '把握大局是执法为民的根本出发点。',
    isCollect: false,
    answerList: [
      {value: 1, label: '正确', isChecked: false},
      {value: 2, label: '错误', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 2,
    allAnswerNum: 512,
    allAnswerCorrectRate: 99,
    fallibility: 1,
    analysis: '《社会主义法制理念读本》第六章二、以人为本是执法为民的根本出发点',
    isShowQuestionAnalysis: false,
  },
]

// 论述题模拟数据 type:4
export const discussQuestionData = [
  {
    type: 4,
    fraction: 20,
    title: '请论述辩护律师在公安机关侦查阶段享有的诉讼权利。',
    isCollect: false,
    answerList: [],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 128,
    allAnswerCorrectRate: 93,
    fallibility: 2,
    analysis: '根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,吴某已经确诊新冠肺炎。隔离期未满擅自脱离隔离治疗，并进入公共交通工具,危害公共安全的，未造成他人感染新冠肺炎。依照刑法第一百一十四条的规定,以以危险方法危害公共安全罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》（法发[2020]7号)规定，梁某拒绝执行卫生防疫机构依照传染病防治法提出的防控措施,引起新型冠状病毒传播，依照刑法第三百三十条的规定，以妨害传染病防治罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,何某以暴力、威胁方法阻碍受国家机关委托代表国家机关行使疫情防控职权的组织中从事公务的人员依法履行为防控疫情而采取的防疫、检疫、强制隔离、隔离治疗等措施的，依照刑法第二百七十七条第一款、第三款的规定，以妨害公务罪定罪处罚。',
    isShowQuestionAnalysis: false,
  },
  {
    type: 4,
    fraction: 18,
    title: '请论述辩护律师在公安机关~~~~~~~',
    isCollect: false,
    answerList: [],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 18,
    allAnswerCorrectRate: 70,
    fallibility: 2,
    analysis: '根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,吴某已经确诊新冠肺炎。隔离期未满擅自脱离隔离治疗，并进入公共交通工具,危害公共安全的，未造成他人感染新冠肺炎。依照刑法第一百一十四条的规定,以以危险方法危害公共安全罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》（法发[2020]7号)规定，梁某拒绝执行卫生防疫机构依照传染病防治法提出的防控措施,引起新型冠状病毒传播，依照刑法第三百三十条的规定，以妨害传染病防治罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,何某以暴力、威胁方法阻碍受国家机关委托代表国家机关行使疫情防控职权的组织中从事公务的人员依法履行为防控疫情而采取的防疫、检疫、强制隔离、隔离治疗等措施的，依照刑法第二百七十七条第一款、第三款的规定，以妨害公务罪定罪处罚。',
    isShowQuestionAnalysis: false,
  },
]