import { motion } from 'framer-motion';
import { Link, useMatch, useNavigate } from 'react-router-dom';
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

export default function Details() {
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

  // Modal
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);

  const movieMatch = useMatch(`/details/:movieId`);
  let movieData: IGetMoviesResult | undefined;
  let movieKey: 'popular' | 'now' | 'coming' | undefined;

  if (popularData) {
    movieKey = 'popular';
    movieData = popularData;
  } else if (nowData) {
    movieKey = 'now';
    movieData = nowData;
  } else if (comingData) {
    movieKey = 'coming';
    movieData = comingData;
  }

  const clickedMovie =
    movieMatch?.params.movieId &&
    movieData?.results.find(
      (movieKey) => String(movieKey.id) === movieMatch.params.movieId
    );

  const StarIcon = (num: number) => {
    const roundedRating = Math.floor(num);
    const maxStars = 10;

    let stars = '';
    for (let i = 1; i <= maxStars; i++) {
      if (i <= roundedRating) {
        stars += '⭐️';
      } else {
        stars += '☆';
      }
    }
    return stars;
  };

  return (
    <>
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
    </>
  );
}
