import { useSelector } from 'react-redux';
import { ChatMessageState } from '../../..';
import { useNetwork } from '../useNetwork';

export function useMessages(): ChatMessageState[] {
  const network = useNetwork();
  return useSelector((state) => network.selector(state).class.chatMessages);
}