from rest_framework import serializers

from core.models import Game, Tournament, User, Participation, GameInvitation

class GameUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']  # Adjust fields based on the actual User model



class GameScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['score1', 'score2']  # Only include the fields that can be updated
        extra_kwargs = {
            'score1': {'required': False},
            'score2': {'required': False},
        }

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'tournament', 'player1', 'player2', 'score1', 'score2']

    def validate(self, data):
        """
        Check that the two players are not the same and that both are in the tournament if applicable.
        """
        if data['player1'] == data['player2']:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same person.")

        tournament = data.get('tournament')  # Use .get() to avoid KeyError
        if tournament:
            tournament_participants = tournament.participants.all()
            if not (data['player1'] in tournament_participants and data['player2'] in tournament_participants):
                raise serializers.ValidationError("Both players must be participants in the tournament.")

        return data

    def update(self, instance, validated_data):
        instance.score1 = validated_data.get('score1', instance.score1)
        instance.score2 = validated_data.get('score2', instance.score2)
        instance.save()
        return instance

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['id', 'user', 'tournament', 'nickname']

    def validate(self, data):
        # Check if the Participation already exists
        if Participation.objects.filter(user=data['user'], tournament=data['tournament']).exists():
            raise serializers.ValidationError("This user is already registered in this tournament.")
        return data

    def create(self, validated_data):
        # Create a new participation instance with the validated data
        participation = Participation.objects.create(**validated_data)
        return participation

class TournamentSerializer(serializers.ModelSerializer):
    participants = GameUserSerializer(many=True, read_only=True)  # Display participant details

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'participants']

class GameInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameInvitation
        fields = '__all__'

    def validate(self, data):
        if data['player1'] == data['player2']:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same person.")
        return data