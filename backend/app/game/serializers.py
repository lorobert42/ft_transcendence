from rest_framework import serializers
from django.db import transaction
import random
import math



from core.models import Game, Tournament, User, Participation

class GameUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']  # Adjust fields based on the actual User model


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'tournament', 'tournamentRound', 'roundGame', 'player1', 'player2', 'score1', 'score2',
                  'player1_status', 'player2_status', 'game_status', 'start_time']
        read_only_fields = ['id', 'tournament', 'tournamentRound', 'roundGame', 'player1', 'score1', 'score2',
                            'player1_status', 'player2_status', 'game_status', 'start_time']  # Assuming these should not be set directly

    def validate_player2(self, value):
        """
        Ensure that player2 is not the same as the authenticated user.
        """
        request_user = self.context['request'].user
        if value == request_user:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same person.")
        return value

    def validate(self, data):
        """
        Ensure that player2 is in the tournament if applicable.
        """
        tournament = data.get('tournament')
        if tournament and 'player2' in data:
            if data['player2'] not in tournament.participants.all():
                raise serializers.ValidationError("Player2 must be a participant in the tournament.")
        return data


class ParticipationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['status']  # Only include the status field

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name']  # Adjust fields based on the actual User model


class ParticipationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)  # Embed user details

    class Meta:
        model = Participation
        fields = ['id', 'user', 'tournament', 'status']

    def validate(self, data):
        # Retrieve the user and tournament from the context if they are not in the validated data
        user = self.context['request'].user
        tournament = data.get('tournament')

        # Check if the Participation already exists
        if Participation.objects.filter(user=user, tournament=tournament).exists():
            raise serializers.ValidationError("This user is already registered in this tournament.")
        return data

    def create(self, validated_data):
        # Since `user` is not directly in the validated data, fetch from the context
        user = self.context['request'].user
        # Create a new participation instance with the validated data
        participation = Participation.objects.create(user=user, **validated_data)
        return participation


class TournamentSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True
    )
    has_started = serializers.BooleanField(default=False)

    class Meta:
        model = Tournament
        fields = ['id', 'name','has_started', 'participants', ]
        extra_kwargs = {
            'has_started': {'read_only': False}
        }

    def validate_participants(self, participants):
        if len(set(participants)) < 3 or len(set(participants)) > 8:
            raise serializers.ValidationError("A tournament must have between 3 and 8 unique participants.")
        return participants

    def create(self, validated_data):
        participants_data = validated_data.pop('participants')

        with transaction.atomic():
            tournament = Tournament.objects.create(**validated_data)

            # Create Participation instances
            seen = set()
            for user in participants_data:
                if user in seen:
                    raise serializers.ValidationError(f"Duplicate entry for user {user.id} found.")
                seen.add(user)
                Participation.objects.create(user=user, tournament=tournament)

        return tournament


    def to_representation(self, instance):
        # Custom representation to show participants
        representation = super().to_representation(instance)
        participation_set = Participation.objects.filter(tournament=instance)
        representation['participants'] = ParticipationSerializer(participation_set, many=True).data
        return representation


class TournamentPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['has_started']
        extra_kwargs = {
            'has_started': {'read_only': False}
        }

    def validate_has_started(self, value):
        if value == True:
            # Count the number of accepted participants
            accepted_participants_count = self.instance.participation_set.filter(status='accepted').count()
            if accepted_participants_count < 3:
                raise serializers.ValidationError("At least three participants must have accepted to start the tournament.")
        return value

    def update(self, instance, validated_data):
        has_started = validated_data.get('has_started')

        if has_started and not instance.has_started:
            # Ensure the condition is met before setting has_started to True
            with transaction.atomic():
                instance.has_started = has_started
                instance.save()

                 # If the tournament is now starting, create initial games
                self.create_initial_games(instance)

        return instance

    # Example method to be invoked after setting has_started to True
    def create_initial_games(self, tournament):
        participants = list(tournament.participation_set.filter(status='accepted').values_list('user', flat=True))
        if participants:
            self.create_complete_bracket(tournament, participants)

    def create_complete_bracket(self, tournament, participant_ids):
        participants = list(User.objects.filter(id__in=participant_ids))
        random.shuffle(participants)

        current_round = 1
        round_game_counter = 1
        games = []
        stack = []

        for participant in participants:
            stack.append(participant)

        while len(stack) != 1 or len(games) != 0:
            while len(stack) >= 2:
                first_participant = stack.pop(0)
                second_participant = stack.pop(0)
                game = Game.objects.create(
                        tournament=tournament,
                        player1=first_participant if isinstance(first_participant, User) else None,
                        player2=second_participant if isinstance(second_participant, User) else None,
                        tournamentRound=current_round,
                        roundGame=round_game_counter
                    )
                games.append(game)
                round_game_counter += 1
            round_game_counter = 1
            current_round += 1
            while len(games) > 0:
                stack.insert(0, games.pop())

