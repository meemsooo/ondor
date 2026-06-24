import { useEffect, useRef, useState } from 'react';
import { STORAGE_EVENT } from '../services/storage';

/**
 * service 에서 데이터를 읽어와 상태로 관리하고,
 * 데이터가 추가/수정/삭제되면(혹은 화면이 다시 포커스되면) 자동으로 다시 읽어온다.
 * → 홈/목록 화면이 항상 최신 localStorage 데이터를 반영하게 한다.
 *
 * @param {() => any} loader 매번 최신 데이터를 반환하는 함수
 */
export function useLiveQuery(loader) {
  const loaderRef = useRef(loader);
  const [data, setData] = useState(() => loader());

  // 렌더 중이 아닌 커밋 이후에 최신 loader 를 보관한다.
  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    const refresh = () => setData(loaderRef.current());
    refresh();
    window.addEventListener(STORAGE_EVENT, refresh);
    window.addEventListener('storage', refresh); // 다른 탭 변경
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(STORAGE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return data;
}
