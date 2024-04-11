
WIDTH, HEIGHT = 1000, 700  # Game size
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125  # Paddle size
D_BALL_RAD = 10  # Radius of the ball

KEY_W, KEY_S, KEY_I, KEY_K = 1, 2, 3, 4

class GameClass:
    def __init__(self, game_id):
        self.id = game_id
        self.count = 0
        self.active = False
        self.task = None

class Ball():
    MAX_VEL = 10
    MAX_VEL_Y = 15

    def __init__(self, x, y, rad):
        self.x = self.origin_x = x
        self.y = self.origin_y = y
        self.rad = rad
        self.x_vel = self.MAX_VEL
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.origin_x
        self.y = self.origin_y
        self.x_vel *= -1
        self.y_vel = 0


class Paddle():
    """Paddle class"""
    VEL = 10

    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.heigth = height

    def move(self, up=True):
        if up:
            self.y -= self.VEL
        else:
            self.y += self.VEL

class GameManager():
    """Manager of the game"""
    ball = Ball(WIDTH // 2, HEIGHT // 2, D_BALL_RAD)
    paddle_left = Paddle(20, HEIGHT / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH,
                         PADDLE_HEIGHT)
    right_paddle = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT / 2 - PADDLE_HEIGHT / 2,
                          PADDLE_WIDTH, PADDLE_HEIGHT)

    def handle_collision(ball, left, right):
        """ Change the ball direction if it hit the ceiling """
        if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad <= 0: # Ball hit the ceiling --> replaced '==' with '>='
            ball.y_vel *= -1 # Change the y direction of the ball instead of x
        # Cheking the direction of the ball
        if ball.x_vel < 0:
            # Ball goes left to right ->
            if ball.y >= left.y and ball.y <= left.y + left.height and \
                    ball.x - ball.rad <= left.x + left.width:
                # Ball is hitting the left_paddle
                middle_y = left.y + left.height / 2
                difference_in_y = middle_y - ball.y
                reduction_factor = (left.heigth / 2) / ball.MAX_VEL_Y
                y_vel = difference_in_y / reduction_factor
                ball.y_vel = -1 * y_vel
                # Will change the velocity of the ball depending of where the
                # Ball is hitting the paddle

        else:
            # Ball goes right to left <-
            if ball.y >= right.y and ball.y <= right.y + right.heigth and \
                    ball.x + ball.rad >= right.x:
                # Ball is hitting the rigth_paddle
                middle_y = right.x + right.height / 2
                difference_in_y = middle_y - ball.y
                reduction_factor = (right.height / 2) / ball.MAX_VEL_Y
                y_vel = difference_in_y / reduction_factor
                ball.y_vel = -1 * y_vel
                # Will change the velocity of the ball depending of where the
                # Ball is hitting the paddle

    def handle_paddle_move(key, left, right):
        """Function that will move the paddle in function of the key pressed"""
        if key is KEY_W and left.y - left.VEL >= 0:
            left.move(up=True)
        if key is KEY_S and left.y + left.VEL + left.height <= HEIGHT:
            left.move(up=False)
        if key is KEY_I and right.y - right.VEL >= 0:
            right.move(up=True)
        if key is KEY_K and right.y + right.VEL + right.height <= HEIGHT:
            right.move(up=False)

    """
    The logic for the game is:

        while (game.on):
            for event:
                if event == QUIT:
                    break

            key = key_pressed
            handle_paddle_move(key, left_paddle, right_paddle)
            ball.move()
            handle_collision(ball, left_paddle, right_paddle)

            if ball.x < 0:
                ball.reset()
                score_r++
            elif ball.x > WIDTH:
                ball.reset()
                score_l++

            if score_r == limit or score_l == limit:
                stop_game
                break
    """
