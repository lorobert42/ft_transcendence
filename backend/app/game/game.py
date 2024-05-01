
WIDTH, HEIGHT = 1000, 700  # Game size
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125  # Paddle size
D_BALL_RAD = 10  # Radius of the ball

class GameClass():
    def __init__(self, game_id, player1_type='human', player2_type='human'):
        self.id = game_id
        self.p1_type = player1_type
        self.p2_type = player2_type
        self.count = 0
        self.active = False
        self.p1 = {
            'name' : None,
            'state' : False,
        }
        self.p2 = {
            'name' : None,
            'state' : False,
        }
        self.task = None
        self.ball = Ball(WIDTH // 2, HEIGHT // 2, D_BALL_RAD)
        self.paddle_l = Paddle(20, HEIGHT / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_r = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.score_p1 = 0
        self.score_p2 = 0
        self.max_score = 5

class Ball():
    MAX_VEL = 10
    MAX_VEL_Y = 15

    def __init__(self, x, y, rad):
        self.x = self.origin_x = x
        self.y = self.origin_y = y
        self.rad = rad
        self.max_vel = 10
        self.max_vel_y = 15
        self.x_vel = self.max_vel
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def pos(self):
        return {
            'x': self.x,
            'y': self.y,
        }

    def reset(self):
        self.x = self.origin_x
        self.y = self.origin_y
        self.x_vel *= -1
        self.y_vel = 0


class Paddle():
    """Paddle class"""
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.vel = 10

    def move(self, up=True):
        if up:
            self.y -= self.vel
        else:
            self.y += self.vel

    def pos(self):
        return {
            'x': self.x,
            'y': self.y,
        }
