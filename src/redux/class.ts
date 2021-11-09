import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { ContentType, ClassState, UserID, Content, ChatMessageState, DeviceID, ActivityStreamID, DeviceState, Trophy, UserState, UserRole, Timestamp } from '../models';
import { ValueOf, values } from '../types';
import { isAllowedToBecomeHost } from './authorization';

type Reducer<P = void, T extends string = string> = CaseReducer<ClassState, PayloadAction<P, T>>;

export const INITIAL_ROOM_STATE: ClassState = {
  users: {},
  devices: {},
  chatMessages: [],
  content: {
    type: ContentType.Blank,
  },
  hostUserId: undefined,
  classEndTime: undefined,
};

const setState: Reducer<ClassState> = (_state, action) => {
  return action.payload;
};

const endClass: Reducer<{ timestamp: Timestamp }> = (state, action) => {
  state.classEndTime = action.payload.timestamp;
};

const deviceConnect: Reducer<{name: string, device: DeviceState, role: UserRole}> = (
  state,
  action
) => {
  const { name, device, role } = action.payload;
  //Device
  state.devices[device.id] = device;
  //User
  const userId = device.userId;
  const user = state.users[userId]
  if(user) {
    user.deviceIds.push(device.id);
  } else {
    state.users[userId] = {
      id: userId,
      name,
      role,
      deviceIds: [device.id],
      trophies: [],
    };
  }
  if(!state.hostUserId && isAllowedToBecomeHost(role)) {
    state.hostUserId = userId;
  }

};

const deviceDisconnect: Reducer<{deviceId: DeviceID}> = (
  state,
  action
) => {
  const { deviceId } = action.payload;
  const device = state.devices[deviceId] as WritableDraft<DeviceState> | undefined;
  delete state.devices[deviceId];
  if(!device) { return; }
  const user = state.users[device.userId] as WritableDraft<UserState> | undefined;
  if(!user) { return; }
  user.deviceIds = user.deviceIds.filter((id) => id !== deviceId);

  if(state.hostUserId === user.id) {
    state.hostUserId = undefined;
    const userIds = Object.keys(state.users) as UserID[];
    // userIds.sort(); sort may be unecessary
    // It ensures deterministic evaluation on all clients, regardless of the keys array ordering
    // Which could be affected by serialization and deserialization during network messages
    userIds.sort();
    for(const userId of userIds) {
      const user = state.users[userId];
      if(user && isAllowedToBecomeHost(user.role)) {
        state.hostUserId = user.id;
        break;
      }
    }
  }
};

const setHost: Reducer<UserID> = (state, action) => {
  state.hostUserId = action.payload;
};

const setContent: Reducer<Content> = (state, action) => {
  state.content = action.payload;
};

const addChatMessage: Reducer<ChatMessageState> = (
  state,
  action
) => {
  const chatMessage = action.payload;
  state.chatMessages.push(chatMessage);
};

const setActivityStreamId: Reducer<{deviceId: DeviceID, activityStreamId: ActivityStreamID}> = (
  state,
  action
) => {
  const { deviceId, activityStreamId } = action.payload;
  const device = state.devices[deviceId]
  if(!device) { return } 
  device.activityStreamID = activityStreamId;
};

const rewardTrophyToUser: Reducer<{userId: UserID, trophy: Trophy}> = (
  state,
  action
) => {
  const { userId, trophy } = action.payload;
  state.users[userId]?.trophies.push(trophy);
};

const rewardTrophyToAll: Reducer<{trophy: Trophy}> = (
  state,
  action
) => {
  const { trophy } = action.payload;
  values(state.users).forEach(user => user.trophies.push(trophy))
};


export const classSlice = createSlice({
  name: 'class',
  initialState: INITIAL_ROOM_STATE,
  reducers: {
    setState,
    endClass,
    deviceConnect,
    deviceDisconnect, 
    setHost,
    setContent,
    addChatMessage,
    setActivityStreamId,
    rewardTrophyToUser,
    rewardTrophyToAll,
  },
});

export const classReducer = classSlice.reducer;
export const classActions = classSlice.actions;
export type ClassActionType = keyof typeof classActions 
export type ClassAction = ReturnType<ValueOf<typeof classActions>>

export type ClassActionTypeToPayload = {
  [K in keyof typeof classActions]: ReturnType<typeof classActions[K]>["payload"]; 
}