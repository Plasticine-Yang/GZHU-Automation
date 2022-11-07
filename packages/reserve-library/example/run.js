import { run } from '../dist/reserve-library.esm.js'

const rules = [
  {
    weekday: 'monday',
    area: 'firstFloor',
    roomName: '学习室E21',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'tuesday',
    area: 'firstFloor',
    roomName: '学习室E23',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'wednesday',
    area: 'firstFloor',
    roomName: '学习室E24',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'thursday',
    area: 'firstFloor',
    roomName: '学习室E25',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'friday',
    area: 'firstFloor',
    roomName: '学习室E21',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'saturday',
    area: 'firstFloor',
    roomName: '学习室E23',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
  {
    weekday: 'sunday',
    area: 'firstFloor',
    roomName: '学习室E24',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  },
]

run({ useEnv: true, rules })
