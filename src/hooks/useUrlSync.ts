import { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFestivalContext } from './useFestivalContext';
import {
  decodeDistrict,
  decodeFestivalTitle,
  encodeDistrict,
  encodeFestivalTitle,
  isValidDistrict
} from '@utils/urlUtils';

export const useUrlSync = () => {
  const { district, festivalTitle } = useParams<{
    district?: string;
    festivalTitle?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedDistrict,
    selectedFestival,
    viewMode,
    allFestivals,
    setSelectedDistrict,
    setSelectedFestival,
    setViewMode,
    navigateToNotFound,
  } = useFestivalContext();

  const isUrlDriven = useRef(false);
  const hasInitializedRef = useRef(false);

  // URL -> State 동기화 (마운트 및 URL 변경 시)
  useEffect(() => {
    if (!allFestivals.length) return; // 데이터 로드 대기

    isUrlDriven.current = true;

    const decodedDistrict = district ? decodeDistrict(district) : null;
    const decodedFestival = festivalTitle ? decodeFestivalTitle(festivalTitle) : null;

    if (decodedDistrict) {
      if (!isValidDistrict(decodedDistrict)) {
        // 유효하지 않은 지역구 -> 404
        navigateToNotFound();
        isUrlDriven.current = false;
        return;
      }

      if (decodedFestival) {
        // 제목과 지역구로 축제 찾기
        const festival = allFestivals.find(
          f => f.TITLE === decodedFestival && f.GUNAME === decodedDistrict
        );
        if (festival) {
          setSelectedDistrict(decodedDistrict);
          setSelectedFestival(festival);
          setViewMode('detail');
        } else {
          // 축제 없으면 404
          navigateToNotFound();
        }
      } else {
        // URL에 지역구만 있음
        setSelectedDistrict(decodedDistrict);
        setViewMode('list');
      }
    } else if (location.pathname === '/') {
      // 루트 경로 - 지도 표시
      setSelectedDistrict(null);
      setSelectedFestival(null);
      setViewMode('map');
    }

    hasInitializedRef.current = true;
    isUrlDriven.current = false;
  }, [district, festivalTitle, allFestivals]);

  // State -> URL 동기화 (사용자 인터랙션으로 상태 변경 시)
  useEffect(() => {
    // 초기화 전에는 URL 변경하지 않음
    if (!hasInitializedRef.current) return;

    if (isUrlDriven.current) return; // URL에서 변경된 경우 스킵

    // notfound 상태일 때는 URL 변경하지 않음
    if (viewMode === 'notfound') return;

    let targetPath = '/';

    if (viewMode === 'detail' && selectedFestival && selectedDistrict) {
      targetPath = `/${encodeDistrict(selectedDistrict)}/${encodeFestivalTitle(selectedFestival.TITLE)}`;
    } else if ((viewMode === 'list' || viewMode === 'map') && selectedDistrict) {
      targetPath = `/${encodeDistrict(selectedDistrict)}`;
    }

    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: false });
    }
  }, [viewMode, selectedDistrict, selectedFestival?.TITLE]);

  return { navigate };
};
