/* eslint-disable @typescript-eslint/no-empty-interface */

import { NewType } from "./types";

export enum FeedbackType {
  END_CLASS,
  LEAVE_CLASS,
}

export enum QuickFeedbackType {
  VIDEO,
  AUDIO,
  PRESENTATION,
  OTHER,
}

export interface QuickFeedback {
  type: QuickFeedbackType;
  stars: number | null;
}

export interface PageEventIn {
  sequenceNumber: number;
  isKeyframe: boolean;
  eventsSinceKeyframe: number;
  eventData: string;
}

export enum ContentType {
  Blank = "Blank",

  // ActivityStreamID
  Stream = "Stream", // Consume a DOM (Activity) stream
  // URLs
  Activity = "Activity", //Produce a DOM (Activity) Stream
  Video = "Video", //
  Audio = "Audio",
  Image = "Image",
  //WebRTC Stream IDs
  Camera = "Camera",
  Screen = "Screen",
}

export type UserID = NewType<string, "UserID">;
export const newUserId = (value: string): UserID => value as UserID;

export type DeviceID = NewType<string, "DeviceID">;
export const newDeviceId = (value: string): DeviceID => value as DeviceID;

export type ActivityStreamID = NewType<string, "ActivityStreamID">;
export const newActivityStreamId = (value: string): ActivityStreamID =>
  value as ActivityStreamID;

export type WebRTCStreamID = NewType<string, "WebRTCStreamID">;
export const newWebRtcStreamId = (value: string): WebRTCStreamID =>
  value as WebRTCStreamID;

export type Timestamp = NewType<number, "Timestamp">;
export const newTimestamp = (value: number): Timestamp => value as Timestamp;

export type TrophyType = NewType<string, "TrophyType">;
export const newTrophyType = (value: string): TrophyType => value as TrophyType;

export type UserRole = NewType<string, "UserRole">;
export const newUserRole = (role: string): UserRole =>
  role.toLowerCase() as UserRole;

// Class State
// Change to Union
export interface Content {
  type: ContentType;
  contentLocation: string;
}

export interface Trophy {
  timestamp: Timestamp;
  type: TrophyType;
  from: UserID;
}

export interface UserState {
  id: UserID;
  name: string;
  role: UserRole;
  trophies: Trophy[];
  deviceIds: DeviceID[];
}

export interface DeviceState {
  id: DeviceID;
  userId: UserID;
  activityStreamID?: ActivityStreamID;
  webRTCStreamIDs: WebRTCStreamID[];
}

export interface ChatMessageState {
  userId: UserID;
  timestamp: Timestamp;
  text: string;
}

export interface ClassState {
  users: Record<UserID, UserState>;
  devices: Record<DeviceID, DeviceState>;

  chatMessages: ChatMessageState[];
  content: Content;
  hostDeviceId?: DeviceID;
  classEndTime?: Timestamp;
}

export interface ChatMessageNotification {
  id: string;
  user: UserState;
  message: string;
}

export interface ContentNotification {
  type: ContentType;
  contentId: string;
}

export interface SessionNotification {
  // webRTC: WebRTC
}

export interface TrophyNotification {
  from: string;
  user: string;
  kind: string;
}

export interface VideoSynchronize {}
export interface WhiteboardStateOut {}
export interface WhiteboardEventOut {}
export interface ClassNotification {
  chatMessage: ChatMessageNotification;
  join: DeviceState;
  leave: DeviceState;
  content: ContentNotification;
  trophy: TrophyNotification;

  //webRTC deprecated?
  sfu: string;
  session: SessionNotification;
}
