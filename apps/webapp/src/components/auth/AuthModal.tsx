import React, { useState } from 'react';
import {
  Dialog,
  useTheme,
  useMediaQuery,
  AppBar,
  Slide,
  Toolbar,
  TransitionProps,
  IconButton,
  Typography,
  Button,
} from '@libs/mui';
import { Close } from '@libs/mui/icons';
import { FormType } from '@libs/shared-types';
import { Login, Signup } from '@libs/components';
import { useSpring, animated } from 'react-spring';

export default function AuthModal({
  handleClose,
  open,
  formType,
  setFormType,
}: {
  handleClose: () => void;
  open?: boolean;
  formType: FormType;
  setFormType: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  const [slideSide, setSlideSide] = useState(false);
  const handleCloseWithSlide = () => {
    setSlideSide(false);
    handleClose();
  };
  const setFormTypeWithSlide = (formType) => {
    setSlideSide(true);
    setFormType(formType);
  };
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const imgStyle = {
    maxHeight: 240,
    maxWidth: 520,
    alignSelf: 'center',
    overflow: 'hidden',
  };
  const AnimatedDialog = animated(Dialog);
  const styles1 = useSpring({
    opacity: formType === 'signup' ? 1 : 0,

    width: formType === 'signup' ? '100%' : '50%',
    height: formType === 'signup' ? '100%' : '50%',
    config: { duration: 500 },
  });
  const styles2 = useSpring({
    opacity: formType === 'login' ? 1 : 0,
    width: formType === 'login' ? '100%' : '50%',
    height: formType === 'login' ? '100%' : '50%',
    config: { duration: 500 },
  });
  return (
    <AnimatedDialog
      fullScreen={fullScreen}
      transitionDuration={slideSide ? 0 : 700}
      onClose={handleCloseWithSlide}
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
    >
      {fullScreen ? (
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseWithSlide}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Login
            </Typography>
          </Toolbar>
        </AppBar>
      ) : (
        <img alt={'books'} style={imgStyle} src="/book-small.jpg"></img>
      )}
      <Typography variant="h4" align="center">
        Welcome to LearnIt
      </Typography>
      <Typography variant="subtitle1" align="center">
        Learn and test your knowledge
      </Typography>
      {formType === 'signup' && (
        <animated.div style={{ ...styles1 }}>
          <Signup setFormType={setFormTypeWithSlide}></Signup>
        </animated.div>
      )}
      {formType === 'login' && (
        <animated.div style={styles2}>
          <Login setFormType={setFormTypeWithSlide}></Login>
        </animated.div>
      )}
    </AnimatedDialog>
  );
}
