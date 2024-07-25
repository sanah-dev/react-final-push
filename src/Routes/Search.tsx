import { useLocation } from 'react-router-dom';

export default function Search() {
  // 현재 위치 정보 가져오기
  const location = useLocation();
  // URLSearchParams를 사용하여 검색어 가져오기
  const keyword = new URLSearchParams(location.search).get('keyword');

  return (
    <>
      <h1>Search</h1>
      {keyword ? <p>Keyword: {keyword}</p> : <p>No keyword found in the URL</p>}
    </>
  );
}
