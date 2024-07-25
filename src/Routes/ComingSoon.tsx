import { useQuery } from '@tanstack/react-query';
import {
  getComingSoon,
  IGetMoviesResult,
  makeBgPath,
  makeImagePath,
} from '../api';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useMatch, useNavigate } from 'react-router-dom';

/* Style */
const Section = styled.section`
  margin: 68px 0;
`;
// Title
const MainTitle = styled.h1`
  padding: 30px 100px;
  font-size: 24px;
  font-weight: 700;
`;
// List
const Wapper = styled.section`
  margin-bottom: 80px;
  padding: 0px 100px;

  h3 {
    padding: 16px 0;
    font-size: 20px;
  }
`;
const List = styled(motion.ul)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;
`;
const Item = styled(motion.li)<{ bgphoto: string }>`
  height: 200px;
  margin-bottom: 80px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.6);
  cursor: pointer;
`;
const ItemTitle = styled.span`
  display: block;
  text-align: center;
  width: 100%;
  margin-top: 210px;
`;
// Modal
const FlexBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 8px;
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 8px;
  background-color: rgba(20, 20, 20, 1);
  color: ${(props) => props.theme.white.default};
  font-size: 16px;
`;
const ModalImg = styled.img`
  width: 100%;
  height: auto;
`;
const ModalTitle = styled.h2`
  position: absolute;
  left: 8px;
  bottom: 0;
  color: ${(props) => props.theme.white.hover};
  font-size: 36px;
  font-weight: 700;
  text-shadow: 0 0 6px black;
`;

/* Animation */
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

export default function ComingSoon() {
  // Data
  const { data: comingData, isLoading: comingLoading } =
    useQuery<IGetMoviesResult>({
      queryKey: ['coming'],
      queryFn: getComingSoon,
    });

  // Modal
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);
  const onBoxClickedComing = (movieId: number) => {
    navigate(`/coming-soon/details/${movieId}`);
  };

  const movieMatch = useMatch(`/coming-soon/details/:movieId`);
  const clickedMovie =
    movieMatch?.params.movieId &&
    comingData?.results.find(
      (coming) => String(coming.id) === movieMatch.params.movieId
    );

  return (
    <>
      {comingLoading ? (
        'Loading..'
      ) : (
        <Section>
          <MainTitle>기다림이 아깝지 않은 상영 예정 영화 🎥</MainTitle>

          <Wapper>
            <List>
              {comingData?.results.map((coming) => (
                <Item
                  layoutId={String(coming.id)}
                  key={coming.id}
                  variants={sliderHoverVariants}
                  initial='normal'
                  whileHover='hover'
                  transition={{ type: 'tween' }}
                  onClick={() => onBoxClickedComing(coming.id)}
                  bgphoto={makeImagePath(coming.backdrop_path)}
                >
                  <ItemTitle>{coming.title}</ItemTitle>
                </Item>
              ))}
            </List>
          </Wapper>

          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Modal layoutId={movieMatch!.params.movieId}>
                  {clickedMovie && (
                    <>
                      <ModalCover>
                        <FlexBox>
                          <ModalImg
                            src={makeBgPath(clickedMovie.backdrop_path)}
                            alt={clickedMovie.title}
                          />
                          <ModalTitle>{clickedMovie.title}</ModalTitle>
                        </FlexBox>

                        <FlexBox>
                          <span>🗓️ {clickedMovie.release_date}</span>
                          <span>⭐️ {clickedMovie.vote_average}</span>
                        </FlexBox>

                        <p>{clickedMovie.overview}</p>
                      </ModalCover>
                    </>
                  )}
                </Modal>
              </>
            ) : null}
          </AnimatePresence>
        </Section>
      )}
    </>
  );
}
