using UnityEngine;
using System.Collections.Generic;

public class soundManager : MonoBehaviour
{
    public static soundManager instance;
    [SerializeField] private AudioSource soundObject;

    // Keep track of all active sounds
    private List<AudioSource> activeSources = new List<AudioSource>();

    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
    }

    public void PlaySoundClip(AudioClip audioClip, Transform spawnTransform, float volume)
    {
        // Spawn sound object
        AudioSource audioSource = Instantiate(soundObject, spawnTransform.position, Quaternion.identity);

        // Set properties
        audioSource.clip = audioClip;
        audioSource.volume = volume;
        audioSource.pitch = 1f; // normal speed by default

        // Play sound
        audioSource.Play();

        // Track it
        activeSources.Add(audioSource);

        // Destroy after clip length and remove from list
        float clipLength = audioSource.clip.length / audioSource.pitch;
        Destroy(audioSource.gameObject, clipLength);
        StartCoroutine(RemoveWhenDone(audioSource, clipLength));
    }

    private System.Collections.IEnumerator RemoveWhenDone(AudioSource source, float delay)
    {
        yield return new WaitForSeconds(delay);
        activeSources.Remove(source);
    }

    // Set pitch for all active sounds
    public void SetGlobalPitch(float pitch)
    {
        foreach (var src in activeSources)
        {
            if (src != null)
            {
                src.pitch = pitch;
            }
        }
    }

}
