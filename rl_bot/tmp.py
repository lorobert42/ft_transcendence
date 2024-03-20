import pygame
import sys

# Initialize pygame
pygame.init()

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 20

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

class Ball:
    def __init__(self, x, y, radius, max_vel_x=10, max_vel_y=15):
        self.x = x
        self.y = y
        self.radius = radius
        self.max_vel_x = max_vel_x
        self.max_vel_y = max_vel_y

    def move(self):
        self.x += self.max_vel_x
        self.y += self.max_vel_y

    def draw(self, screen):
        pygame.draw.circle(screen, WHITE, (self.x, self.y), self.radius)

    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.max_vel_x *= -1
        self.max_vel_y = 5

class Paddle:
    """Paddle class"""
    def __init__(self, x, y, width, height, vel=10):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.vel = vel

    def move(self, up=True):
        if up and self.y > 0:
            self.y -= self.vel
        elif not up and self.y < HEIGHT - self.height: # check paddle doesn't go off screen
            self.y += self.vel

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, (self.x, self.y, self.width, self.height))

class GameManager:
    """Manager of the game"""
    def __init__(self):
        self.ball = Ball(WIDTH // 2, HEIGHT // 2, BALL_RADIUS)
        self.paddle_left = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.score_left = 0
        self.score_right = 0

    def run(self):
        screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Pong")
        clock = pygame.time.Clock()
        running = True

        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            keys = pygame.key.get_pressed()
            if keys[pygame.K_w]:
                self.paddle_left.move(up=True)
            if keys[pygame.K_s]:
                self.paddle_left.move(up=False)
            if keys[pygame.K_UP]:
                self.paddle_right.move(up=True)
            if keys[pygame.K_DOWN]:
                self.paddle_right.move(up=False)

            self.ball.move()
            self.handle_collision()
            self.check_score()

            screen.fill(BLACK)
            self.ball.draw(screen)
            self.paddle_left.draw(screen)
            self.paddle_right.draw(screen)
            pygame.display.flip()
            clock.tick(FPS)

        pygame.quit()
        sys.exit()

    def handle_collision(self):
        """ Change the ball direction if it hit the ceiling """

        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= HEIGHT:
            self.ball.max_vel_y *= -1 # Changed x to y

        if self.ball.max_vel_x < 0:
            # Ball goes left to right ->
            if self.paddle_left.x + self.paddle_left.width >= self.ball.x - self.ball.radius and \
            self.paddle_left.y <= self.ball.y <= self.paddle_left.y + self.paddle_left.height:
                # Ball is hitting the left_paddle
                if self.ball.x > self.paddle_left.x:  # Ensure collision is at the front of paddle
                    self.ball.max_vel_x *= -1

                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_right.y + self.paddle_right.height / 2) - self.ball.y
                    reduction_factor = (self.paddle_right.height / 2) / self.ball.max_vel_y
                    self.ball.vel_y = difference_in_y / reduction_factor
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle

        if self.ball.max_vel_x > 0:  # Ball moving right
            # Ball goes right to left <-
            if self.paddle_right.x <= self.ball.x + self.ball.radius and \
            self.paddle_right.y <= self.ball.y <= self.paddle_right.y + self.paddle_right.height:
                # Ball is hitting the rigth_paddle
                if self.ball.x < self.paddle_right.x + self.paddle_right.width:  # Ensure collision is at the front of paddle
                    self.ball.max_vel_x *= -1

                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_left.y + self.paddle_left.height / 2) - self.ball.y
                    reduction_factor = (self.paddle_left.height / 2) / self.ball.max_vel_y
                    self.ball.vel_y = difference_in_y / reduction_factor
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle

    def check_score(self):
        if self.ball.x < 0:
            self.score_right += 1
            self.ball.reset()
        elif self.ball.x > WIDTH:
            self.score_left += 1
            self.ball.reset()
        print(f"Score - Left: {self.score_left}, Right: {self.score_right}", end='\r', flush=True)
        

# Main function
if __name__ == "__main__":
    game = GameManager()
    game.run()
