import styled from 'styled-components';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconLogo, IconNoti, IconSearch } from './Icon';

const Nav = styled(motion.nav)`
  z-index: 1;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 60px;
  background-color: ${(props) => props.theme.black.default};
  font-size: 14px;
  color: ${(props) => props.theme.white.default};

  h1 {
    margin-right: 25px;
    cursor: pointer;

    svg {
      width: 89px;
      height: 24px;
    }
  }
`;
const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;

// List
const List = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
`;
const LinkStyled = styled(Link)<{ active: boolean }>`
  color: ${(props) => props.theme.white.default};
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.white.hover};
  }

  ${(props) => props.active && `color: #fff;`}
`;
const Circle = styled(motion.span)`
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 5px;
  height: 5px;
  background-color: ${(props) => props.theme.red};
  border-radius: 5px;
`;

// Search
const SearchForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.white.default};

  &:hover {
    color: ${(props) => props.theme.white.hover};
  }

  svg {
    height: 24px;
    cursor: pointer;
  }
`;
const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 8px;
  padding-right: 36px;
  z-index: -1;
  color: ${(props) => props.theme.white.default};
  font-size: 14px;
  background-color: ${(props) => props.theme.black.default}33;
  border: 1px solid ${(props) => props.theme.white.default};
  border-radius: 4px;

  &::placeholder {
    color: ${(props) => props.theme.white.default}aa;
  }
`;
const Icon = styled(motion.i)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
`;

function Header() {
  /* Animation */
  // cicle icon
  const homeMatch = useMatch('/');
  const popularMatch = useMatch('popular');
  const comingSoonMatch = useMatch('coming-soon');
  const nowPlayingMatch = useMatch('now-playing');
  // scroll event
  const { scrollY } = useScroll();
  const navAnimation = useAnimation();
  const navVariants = {
    top: {
      backgroundColor: 'rgba(0,0,0,0)',
    },
    scroll: {
      backgroundColor: 'rgb(20, 20, 20)',
    },
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start('scroll');
      } else {
        navAnimation.start('top');
      }
    });
  }, [scrollY]);

  /* Search */
  // input animation
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
        opacity: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1, opacity: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  // form
  const [keyword, setKeyword] = useState<string>('');
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    console.log(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.length > 1) {
      navigate(`/search?keyword=${keyword}`);
      setKeyword('');
    } else {
      alert('1글자 이상 입력해주세요');
    }
  };

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={'top'}>
      <FlexBox>
        <h1>
          <LinkStyled to='/' active={homeMatch}>
            <IconLogo />
          </LinkStyled>
        </h1>

        <List>
          <Item>
            <LinkStyled to='/' active={homeMatch}>
              홈 {homeMatch && <Circle layoutId='cicle' />}
            </LinkStyled>
          </Item>
          <Item>
            <LinkStyled to='/popular' active={popularMatch}>
              인기 상영작 {popularMatch && <Circle layoutId='cicle' />}
            </LinkStyled>
          </Item>
          <Item>
            <LinkStyled to='/now-playing' active={nowPlayingMatch}>
              현재 상영작 {nowPlayingMatch && <Circle layoutId='cicle' />}
            </LinkStyled>
          </Item>
          <Item>
            <LinkStyled to='/coming-soon' active={comingSoonMatch}>
              상영 예정작 {comingSoonMatch && <Circle layoutId='cicle' />}
            </LinkStyled>
          </Item>
        </List>
      </FlexBox>
      <FlexBox>
        <SearchForm onSubmit={handleSubmit}>
          <Input
            name='keyword'
            value={keyword}
            onChange={handleChange}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: 'linear' }}
            placeholder='Search for movie name'
          />
          <Icon onClick={toggleSearch}>
            <IconSearch />
          </Icon>
        </SearchForm>
        <Icon>
          <IconNoti />
        </Icon>
      </FlexBox>
    </Nav>
  );
}

export default Header;
