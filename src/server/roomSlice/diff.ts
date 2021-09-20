import pb from 'kidsloop-live-serialization';

type ParticipantMap = { [k: string]: pb.IParticipant };

export function generateStateDiff(
  old: pb.IState,
  latest: pb.IState
): pb.IStateDiff[] {
  const differences = parseParticipants(
    old.participants || {},
    latest.participants || {},
  );

  if ((old.chatMessages || []).length < (latest.chatMessages || []).length) {
    differences.push({
      appendChatMessage: {
        messages: (latest.chatMessages || []).slice(
          Math.max((old.chatMessages || []).length, 0)
        ),
      },
    });
  }
  if (old.host !== latest.host) {
    differences.push({ changeHost: { hostId: latest.host } });
  }
  if (old.content !== latest.content) {
    differences.push({ changeContent: { content: latest.content } });
  }
  if (latest.endTimestamp || 0 > 0) {
    differences.push({ classEnded: {} });
  }
  return differences;
}

function parseParticipants(
  old: ParticipantMap,
  latest: ParticipantMap
): pb.IStateDiff[] {
  const differences = [];
  const oldKeys = new Set(Object.keys(old));
  const newKeys = Object.keys(latest);
  const addParticipants: ParticipantMap = {};

  for (const userId of newKeys) {
    if (!oldKeys.has(userId)) {
      addParticipants[userId] = latest[userId];
      continue;
    }
    if (old[userId] !== latest[userId]) {
      addParticipants[userId] = latest[userId];
    }
    oldKeys.delete(userId);
  }

  if (Object.keys(addParticipants).length > 0) {
    differences.push({ addParticipants: { participants: addParticipants } });
  }
  if (oldKeys.size > 0) {
    differences.push({ removeParticipants: { participants: [...oldKeys] } });
  }

  return differences;
}