import styled from 'styled-components';
import {
  getComingSoon,
  getNowPlaying,
  getPopular,
  IGetMoviesResult,
  makeBgPath,
  makeImagePath,
} from '../api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';
import IconRanking from '../Components/IconRanking';
import { IconNextBtn } from '../Components/Icon';
import Details from './Details';

/* Style */
// Cover
const Cover = styled.section<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(20, 20, 20, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 64px;
  font-weight: 700;
`;
const Overview = styled.p`
  width: 75%;
  font-size: 26px;
`;

// Slider
const Slider = styled.section`
  z-index: 0;
  position: relative;
  top: -100px;
  height: 280px;
  margin-bottom: 80px;
  padding: 0px 100px;

  h3 {
    padding: 16px 0;
    font-size: 20px;
  }
`;
const List = styled(motion.ul)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: calc(100% - 200px);
`;
const RankingItem = styled(motion.li)`
  position: relative;
  height: 200px;
  width: 100%;
  cursor: pointer;
  &:first-of-type {
    transform-origin: center left;
  }
  &:last-of-type {
    transform-origin: center right;
  }
  img {
    position: absolute;
    right: 0;
    left: auto;
    top: 0;
    bottom: 0;
    display: inline-block;
    width: 50%;
    height: 200px;
    object-fit: cover;
  }
`;
const Item = styled(motion.li)<{ bgphoto: string }>`
  height: 200px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.6);

  cursor: pointer;
  & + li {
    margin-left: 20px;
  }
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const ItemTitle = styled.span`
  display: block;
  text-align: center;
  width: 100%;
  margin-top: 210px;
`;
const NextBtn = styled.button`
  position: absolute;
  right: 50px;
  width: 30px;
  height: 200px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
  svg {
    transform: scale(2);
  }
`;

// Modal
const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: ${(props) => props.theme.black.default};
  opacity: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.7);
  opacity: 0;
`;
const Modal = styled(motion.div)`
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 40vw;
  height: 80vh;
  margin: auto;
`;
const ModalCover = styled.div`
  width: 100%;
  height: 400px;
  background-position: center center;
  background-size: cover;
`;
const ModalTitle = styled.h2`
  position: relative;
  top: -80px;
  padding: 20px;
  color: ${(props) => props.theme.white.default};
  font-size: 46px;
`;
const ModalOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.default};
`;

/* Animation */
const sliderVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const sliderHoverVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: 'tween',
    },
  },
};

export default function Home() {
  // Data
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetMoviesResult>({ queryKey: ['popular'], queryFn: getPopular });
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMoviesResult>({
    queryKey: ['now'],
    queryFn: getNowPlaying,
  });
  const { data: comingData, isLoading: comingLoading } =
    useQuery<IGetMoviesResult>({
      queryKey: ['coming'],
      queryFn: getComingSoon,
    });
  const isLoading = popularLoading || comingLoading || nowLoading;

  // Slider
  const offset = 5;
  const [popularIndex, setPopularIndex] = useState(0);
  const [nowIndex, setNowIndex] = useState(0);
  const [comingIndex, setComingIndex] = useState(0);

  const [leavingPopular, setLeavingPopular] = useState(false);
  const [leavingNow, setLeavingNow] = useState(false);
  const [leavingComing, setLeavingComing] = useState(false);

  const toggleLeavingPopular = () => setLeavingPopular((prev) => !prev);
  const toggleLeavingNow = () => setLeavingNow((prev) => !prev);
  const toggleLeavingComing = () => setLeavingComing((prev) => !prev);

  const incraseIndex = (data: IGetMoviesResult | undefined) => {
    if (data) {
      const maxIndex = 1;

      if (data === popularData) {
        if (leavingPopular) return;
        toggleLeavingPopular();
        setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (data === nowData) {
        if (leavingNow) return;
        toggleLeavingNow();
        setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (data === comingData) {
        if (leavingComing) return;
        toggleLeavingComing();
        setComingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  // TODO: 각각의 id마다 위아래로 왔다갔다하는데 layout때문일까?
  // TODO: top10 슬라이더를 만들려면 5씩 끊기는게 아니라 10개를 한번에 가져오던지, 2번째 슬라이드에서부터 +5를 해줘야하나..... 좋은 방법이 있을지 코드리뷰시 조언구하기

  // Modal
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/details/${movieId}`);
  };

  return (
    <>
      {isLoading ? (
        'Loading..'
      ) : (
        <>
          <Cover
            bgphoto={makeBgPath(popularData?.results[0].backdrop_path || '')}
          >
            <Title>{popularData?.results[0].title}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Cover>

          <Slider>
            <h3>인기 Top 10</h3>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeavingPopular}
            >
              <List
                variants={sliderVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: 'tween', duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((popular, i) => (
                    <>
                      <RankingItem
                        layoutId={String(popular.id)}
                        key={popular.id}
                        variants={sliderHoverVariants}
                        initial='normal'
                        whileHover='hover'
                        transition={{ type: 'tween' }}
                        onClick={() => onBoxClicked(popular.id)}
                      >
                        <IconRanking num={i + 1} />
                        <motion.img
                          src={makeImagePath(popular.poster_path)}
                          alt={popular.title}
                        />
                      </RankingItem>
                    </>
                  ))}
              </List>
            </AnimatePresence>
            <NextBtn onClick={() => incraseIndex(popularData)}>
              <IconNextBtn />
            </NextBtn>
          </Slider>

          <Slider>
            <h3>현재 상영작</h3>
            <AnimatePresence initial={false} onExitComplete={toggleLeavingNow}>
              <List
                variants={sliderVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: 'tween', duration: 1 }}
                key={nowIndex}
              >
                {nowData?.results
                  .slice(offset * nowIndex, offset * nowIndex + offset)
                  .map((now) => (
                    <>
                      <Item
                        layoutId={String(now.id)}
                        key={now.id}
                        variants={sliderHoverVariants}
                        initial='normal'
                        whileHover='hover'
                        transition={{ type: 'tween' }}
                        onClick={() => onBoxClicked(now.id)}
                        bgphoto={makeImagePath(now.backdrop_path)}
                      >
                        <ItemTitle>{now.title}</ItemTitle>
                      </Item>
                    </>
                  ))}
              </List>
            </AnimatePresence>
            <NextBtn onClick={() => incraseIndex(nowData)}>
              <IconNextBtn />
            </NextBtn>
          </Slider>

          <Slider>
            <h3>상영 예정작</h3>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeavingComing}
            >
              <List
                variants={sliderVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: 'tween', duration: 1 }}
                key={comingIndex}
              >
                {comingData?.results
                  .slice(offset * comingIndex, offset * comingIndex + offset)
                  .map((coming) => (
                    <>
                      <Item
                        layoutId={String(coming.id)}
                        key={coming.id}
                        variants={sliderHoverVariants}
                        initial='normal'
                        whileHover='hover'
                        transition={{ type: 'tween' }}
                        onClick={() => onBoxClicked(coming.id)}
                        bgphoto={makeImagePath(coming.backdrop_path)}
                      >
                        <ItemTitle>{coming.title}</ItemTitle>
                      </Item>
                    </>
                  ))}
              </List>
            </AnimatePresence>
            <NextBtn onClick={() => incraseIndex(comingData)}>
              <IconNextBtn />
            </NextBtn>
          </Slider>

          <AnimatePresence>
            <Details />
          </AnimatePresence>
        </>
      )}
    </>
  );
}
