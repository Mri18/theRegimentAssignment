const authService = require('./auth.service');
const signupController = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};

const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);
    
    res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Access token refreshed',
    });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await authService.logout(refreshToken);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

const logoutAllController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await authService.logoutAll(userId);    

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logout from all devices successful'
        });
    } catch (error) {
        next(error);
    }
};

// const forgotPasswordController = (req, res) => {
//   res.status(200).json({ message: 'Forgot password controller called' });
// };

// const resetPasswordController = (req, res) => {
//   res.status(200).json({ message: 'Reset password controller called' });
// };

module.exports = {
    signupController,
    loginController,
    refreshTokenController,
    logoutController,
    logoutAllController,
    //   forgotPasswordController,
    //   resetPasswordController
};