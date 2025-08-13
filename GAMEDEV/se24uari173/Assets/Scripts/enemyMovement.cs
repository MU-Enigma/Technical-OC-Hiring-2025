using UnityEngine;
using Pathfinding;

public class enemyMovement : MonoBehaviour
{
    public AIPath aiPath;
    [SerializeField] private AudioSource moveAudioSource;
    public Transform player;
    [SerializeField] private float maxVolume = 1f;
    [SerializeField] private float maxDistance = 10f;

    void Update()
    {
        if (aiPath.desiredVelocity.x >= 0.01f)
        {
            transform.localScale = new Vector3(1f, 1f, 1f);
        }

        else if (aiPath.desiredVelocity.x <= -0.01f)
        {
            transform.localScale = new Vector3(-1f, 1f, 1f);
        }

        // Handle audio
        bool isMoving = aiPath.desiredVelocity.magnitude > 0.01f;
        if (moveAudioSource != null)
        {
            moveAudioSource.pitch = Time.timeScale;
        }
        if (isMoving)
        {
            if (!moveAudioSource.isPlaying)
                moveAudioSource.Play();

            if (player != null)
            {
                float distance = Vector3.Distance(transform.position, player.position);
                float t = Mathf.Clamp01(1 - (distance / maxDistance));
                moveAudioSource.volume = t * maxVolume;
            }
            else
            {
                moveAudioSource.volume = 0f;
            }
        }

        else
        {
            if (moveAudioSource.isPlaying)
            {
                moveAudioSource.Stop();
            }
        }
    }
}