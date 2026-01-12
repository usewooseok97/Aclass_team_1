import springIcon from '../assets/spring.png';

const SeasonButton = () => {
  return (
    <button
      className={`btn btn-primary' me-2 my-1 `}

    >
      {/* ✅ 선택된 계절일 때만 아이콘 표시 */}

        <img
          src={springIcon}
          alt={`  아이콘`}
          style={{ width: '20px', height: '20px', marginRight: '6px' }}
        />
    </button>
  );
}

export { SeasonButton };
